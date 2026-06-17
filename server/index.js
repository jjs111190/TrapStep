const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GameRoomManager } = require('./gameRooms');

const app = express();
const httpServer = createServer(app);

// CORS configuration - allow all origins for free deployment
app.use(cors());

// Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins (for free deployment)
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 3001;

// Game Room Manager
const roomManager = new GameRoomManager();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'TrapStep Game Server',
    version: '1.0.0',
    stats: roomManager.getStats()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] Player connected: ${socket.id}`);

  // Send connection confirmation
  socket.emit('connected', { socketId: socket.id });

  // Create room
  socket.on('createRoom', (data) => {
    const { roomCode, room } = roomManager.createRoom(socket.id);

    socket.join(roomCode);

    socket.emit('roomCreated', {
      roomCode,
      playerNumber: 1,
      roomState: room.getState()
    });

    console.log(`[${new Date().toISOString()}] Room created: ${roomCode} by ${socket.id}`);
  });

  // Join room by code
  socket.on('joinRoom', (data) => {
    const { roomCode } = data;

    const result = roomManager.joinRoom(roomCode, socket.id);

    if (result.success) {
      socket.join(roomCode);

      // Notify joiner
      socket.emit('roomJoined', {
        roomCode,
        playerNumber: result.playerNumber,
        roomState: result.room.getState()
      });

      // Notify other player
      socket.to(roomCode).emit('playerJoined', {
        playerId: socket.id,
        playerNumber: result.playerNumber
      });

      console.log(`[${new Date().toISOString()}] Player ${socket.id} joined room: ${roomCode}`);

      // Check if game can start (2 players)
      if (result.room.canStart()) {
        io.to(roomCode).emit('roomReady', {
          roomState: result.room.getState()
        });
      }
    } else {
      socket.emit('error', { message: result.error });
    }
  });

  // Quick match (auto-join available room)
  socket.on('quickMatch', () => {
    let roomCode = roomManager.findAvailableRoom();

    if (!roomCode) {
      // No available room, create one
      const result = roomManager.createRoom(socket.id);
      roomCode = result.roomCode;
      socket.join(roomCode);

      socket.emit('roomCreated', {
        roomCode,
        playerNumber: 1,
        roomState: result.room.getState(),
        waitingForPlayer: true
      });

      console.log(`[${new Date().toISOString()}] Quick match - created room: ${roomCode}`);
    } else {
      // Join available room
      const result = roomManager.joinRoom(roomCode, socket.id);

      if (result.success) {
        socket.join(roomCode);

        socket.emit('roomJoined', {
          roomCode,
          playerNumber: result.playerNumber,
          roomState: result.room.getState()
        });

        socket.to(roomCode).emit('playerJoined', {
          playerId: socket.id,
          playerNumber: result.playerNumber
        });

        console.log(`[${new Date().toISOString()}] Quick match - joined room: ${roomCode}`);

        // Game ready
        io.to(roomCode).emit('roomReady', {
          roomState: result.room.getState()
        });
      }
    }
  });

  // Start game
  socket.on('startGame', (data) => {
    const room = roomManager.getRoomByPlayer(socket.id);

    if (!room) {
      socket.emit('error', { message: 'Not in a room' });
      return;
    }

    const { level, mode } = data;

    if (room.startGame(level || 1, mode || 'coop')) {
      io.to(room.roomCode).emit('gameStarted', {
        level: room.gameState.level,
        mode: room.gameState.mode,
        roomState: room.getState()
      });

      console.log(`[${new Date().toISOString()}] Game started in room: ${room.roomCode}`);
    }
  });

  // Player movement update
  socket.on('playerMove', (data) => {
    const room = roomManager.getRoomByPlayer(socket.id);

    if (!room) return;

    const { position, velocity } = data;
    room.updatePlayerPosition(socket.id, position, velocity);

    // Broadcast to other player (not sender)
    socket.to(room.roomCode).emit('playerUpdate', {
      playerId: socket.id,
      position,
      velocity,
      timestamp: Date.now()
    });
  });

  // Player died
  socket.on('playerDied', () => {
    const room = roomManager.getRoomByPlayer(socket.id);

    if (!room) return;

    room.playerDied(socket.id);

    // Notify both players
    io.to(room.roomCode).emit('playerDeath', {
      playerId: socket.id
    });

    // Check game over condition
    const gameOverResult = room.checkGameOver();

    if (gameOverResult.restart) {
      // Co-op mode: restart level
      setTimeout(() => {
        room.resetPlayers();
        io.to(room.roomCode).emit('gameRestart', {
          reason: 'player_died'
        });
      }, 800); // Small delay for death animation
    }

    console.log(`[${new Date().toISOString()}] Player died: ${socket.id} in room ${room.roomCode}`);
  });

  // Player reached portal
  socket.on('reachPortal', () => {
    const room = roomManager.getRoomByPlayer(socket.id);

    if (!room) return;

    room.playerReachedPortal(socket.id);

    // Notify both players
    io.to(room.roomCode).emit('playerReachedPortal', {
      playerId: socket.id
    });

    // Check game over condition
    const gameOverResult = room.checkGameOver();

    if (gameOverResult.finished) {
      io.to(room.roomCode).emit('gameOver', {
        type: gameOverResult.type,
        winner: gameOverResult.winner,
        roomState: room.getState()
      });

      console.log(`[${new Date().toISOString()}] Game over in room ${room.roomCode}: ${gameOverResult.type}`);
    }
  });

  // Leave room
  socket.on('leaveRoom', () => {
    const result = roomManager.leaveRoom(socket.id);

    if (result) {
      socket.leave(result.roomCode);

      // Notify other player
      if (result.room) {
        socket.to(result.roomCode).emit('playerLeft', {
          playerId: socket.id
        });
      }

      console.log(`[${new Date().toISOString()}] Player ${socket.id} left room: ${result.roomCode}`);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const result = roomManager.leaveRoom(socket.id);

    if (result) {
      // Notify other player
      if (result.room) {
        socket.to(result.roomCode).emit('playerDisconnected', {
          playerId: socket.id
        });
      }
    }

    console.log(`[${new Date().toISOString()}] Player disconnected: ${socket.id}`);
  });

  // Ping/pong for latency measurement
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });
});

// Cleanup old rooms every 10 minutes
setInterval(() => {
  roomManager.cleanup();
  console.log(`[${new Date().toISOString()}] Cleaned up old rooms. Stats:`, roomManager.getStats());
}, 10 * 60 * 1000);

// Start server
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   TrapStep Game Server Started! 🎮    ║
  ╠═══════════════════════════════════════╣
  ║   Port: ${PORT.toString().padEnd(29)} ║
  ║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(20)} ║
  ║   Time: ${new Date().toLocaleString().padEnd(23)} ║
  ╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
