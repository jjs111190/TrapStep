// Game Room Management System

class GameRoom {
  constructor(roomCode, hostSocketId) {
    this.roomCode = roomCode;
    this.hostSocketId = hostSocketId;
    this.players = new Map(); // socketId -> playerData
    this.gameState = {
      level: 1,
      mode: 'coop', // 'coop' or 'race'
      started: false,
      finished: false
    };
    this.createdAt = Date.now();
  }

  addPlayer(socketId, playerData) {
    if (this.players.size >= 2) {
      return { success: false, error: 'Room is full' };
    }

    this.players.set(socketId, {
      id: socketId,
      playerNumber: this.players.size + 1, // 1 or 2
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      isDead: false,
      reachedPortal: false,
      ...playerData
    });

    return { success: true, playerNumber: this.players.size };
  }

  removePlayer(socketId) {
    this.players.delete(socketId);

    // If no players left, room should be deleted
    return this.players.size === 0;
  }

  getPlayerData(socketId) {
    return this.players.get(socketId);
  }

  updatePlayerPosition(socketId, position, velocity) {
    const player = this.players.get(socketId);
    if (player) {
      player.position = position;
      player.velocity = velocity;
      player.lastUpdate = Date.now();
    }
  }

  playerDied(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      player.isDead = true;
    }
  }

  playerReachedPortal(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      player.reachedPortal = true;
    }
  }

  resetPlayers() {
    this.players.forEach(player => {
      player.isDead = false;
      player.reachedPortal = false;
      player.position = { x: 0, y: 0 };
      player.velocity = { x: 0, y: 0 };
    });
  }

  canStart() {
    return this.players.size === 2 && !this.gameState.started;
  }

  startGame(level, mode) {
    if (this.canStart()) {
      this.gameState.level = level;
      this.gameState.mode = mode;
      this.gameState.started = true;
      this.resetPlayers();
      return true;
    }
    return false;
  }

  checkGameOver() {
    if (this.gameState.mode === 'coop') {
      // Co-op: both must reach portal
      const allReached = Array.from(this.players.values()).every(p => p.reachedPortal);
      if (allReached && this.players.size === 2) {
        this.gameState.finished = true;
        return { finished: true, winner: null, type: 'coop_complete' };
      }

      // Co-op: if one dies, restart
      const anyDead = Array.from(this.players.values()).some(p => p.isDead);
      if (anyDead) {
        return { finished: false, restart: true, type: 'player_died' };
      }
    } else if (this.gameState.mode === 'race') {
      // Race: first to reach portal wins
      const winner = Array.from(this.players.values()).find(p => p.reachedPortal);
      if (winner) {
        this.gameState.finished = true;
        return { finished: true, winner: winner.id, type: 'race_winner' };
      }

      // Race: dead players can still continue (opponent might die too)
    }

    return { finished: false };
  }

  getState() {
    return {
      roomCode: this.roomCode,
      playerCount: this.players.size,
      players: Array.from(this.players.values()).map(p => ({
        id: p.id,
        playerNumber: p.playerNumber,
        position: p.position,
        velocity: p.velocity,
        isDead: p.isDead,
        reachedPortal: p.reachedPortal
      })),
      gameState: this.gameState
    };
  }
}

class GameRoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> GameRoom
    this.playerRooms = new Map(); // socketId -> roomCode
  }

  generateRoomCode() {
    // Generate 6-character room code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure unique
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }

    return code;
  }

  createRoom(hostSocketId) {
    const roomCode = this.generateRoomCode();
    const room = new GameRoom(roomCode, hostSocketId);

    room.addPlayer(hostSocketId, { isHost: true });

    this.rooms.set(roomCode, room);
    this.playerRooms.set(hostSocketId, roomCode);

    return { roomCode, room };
  }

  joinRoom(roomCode, socketId) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    const result = room.addPlayer(socketId, { isHost: false });

    if (result.success) {
      this.playerRooms.set(socketId, roomCode);
      return { success: true, room, playerNumber: result.playerNumber };
    }

    return result;
  }

  leaveRoom(socketId) {
    const roomCode = this.playerRooms.get(socketId);

    if (!roomCode) {
      return null;
    }

    const room = this.rooms.get(roomCode);

    if (!room) {
      return null;
    }

    const isEmpty = room.removePlayer(socketId);
    this.playerRooms.delete(socketId);

    // Delete room if empty
    if (isEmpty) {
      this.rooms.delete(roomCode);
    }

    return { roomCode, room: isEmpty ? null : room };
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  getRoomByPlayer(socketId) {
    const roomCode = this.playerRooms.get(socketId);
    return roomCode ? this.rooms.get(roomCode) : null;
  }

  findAvailableRoom() {
    // Find a room with only 1 player (quick match)
    for (const [roomCode, room] of this.rooms.entries()) {
      if (room.players.size === 1 && !room.gameState.started) {
        return roomCode;
      }
    }
    return null;
  }

  // Clean up old empty rooms (run periodically)
  cleanup() {
    const now = Date.now();
    const ROOM_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    for (const [roomCode, room] of this.rooms.entries()) {
      if (room.players.size === 0 && (now - room.createdAt) > ROOM_TIMEOUT) {
        this.rooms.delete(roomCode);
      }
    }
  }

  getStats() {
    return {
      totalRooms: this.rooms.size,
      activePlayers: this.playerRooms.size,
      availableRooms: Array.from(this.rooms.values()).filter(r => r.players.size === 1).length
    };
  }
}

module.exports = { GameRoomManager, GameRoom };
