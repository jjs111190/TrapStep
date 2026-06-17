import { io, Socket } from 'socket.io-client';

export type GameMode = 'coop' | 'race';

export interface PlayerUpdate {
  playerId: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  timestamp: number;
}

export interface RoomState {
  roomCode: string;
  playerCount: number;
  players: any[];
  gameState: {
    level: number;
    mode: GameMode;
    started: boolean;
    finished: boolean;
  };
}

export class SocketManager {
  private socket: Socket | null = null;
  private serverUrl: string;
  private connected: boolean = false;
  private roomCode: string | null = null;
  private playerNumber: number | null = null;

  // Event callbacks
  private callbacks: Map<string, Function[]> = new Map();

  constructor(serverUrl?: string) {
    // Use environment variable or default
    this.serverUrl = serverUrl || import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
          console.log('[SocketManager] Connected to server');
          this.connected = true;
          this.emit('connected');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('[SocketManager] Connection error:', error);
          this.connected = false;
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('[SocketManager] Disconnected from server');
          this.connected = false;
          this.emit('disconnected');
        });

        // Set up event listeners
        this.setupEventListeners();

      } catch (error) {
        reject(error);
      }
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Room events
    this.socket.on('roomCreated', (data) => {
      this.roomCode = data.roomCode;
      this.playerNumber = data.playerNumber;
      this.emit('roomCreated', data);
    });

    this.socket.on('roomJoined', (data) => {
      this.roomCode = data.roomCode;
      this.playerNumber = data.playerNumber;
      this.emit('roomJoined', data);
    });

    this.socket.on('playerJoined', (data) => {
      this.emit('playerJoined', data);
    });

    this.socket.on('roomReady', (data) => {
      this.emit('roomReady', data);
    });

    // Game events
    this.socket.on('gameStarted', (data) => {
      this.emit('gameStarted', data);
    });

    this.socket.on('playerMove', (data: PlayerUpdate) => {
      this.emit('playerMove', data);
    });

    this.socket.on('playerDied', (data) => {
      this.emit('playerDied', data);
    });

    this.socket.on('playerReachedPortal', (data) => {
      this.emit('playerReachedPortal', data);
    });

    this.socket.on('gameRestart', (data) => {
      this.emit('gameRestart', data);
    });

    this.socket.on('gameOver', (data) => {
      this.emit('gameOver', data);
    });

    // Player events
    this.socket.on('playerLeft', (data) => {
      this.emit('playerLeft', data);
    });

    this.socket.on('playerDisconnected', (data) => {
      this.emit('playerDisconnected', data);
    });

    // Error handling
    this.socket.on('error', (data) => {
      console.error('[SocketManager] Server error:', data);
      this.emit('error', data);
    });

    // Pong for latency
    this.socket.on('pong', (data) => {
      this.emit('pong', data);
    });
  }

  // Room management
  createRoom(mode: GameMode = 'coop'): void {
    this.socket?.emit('createRoom', { mode });
  }

  joinRoom(roomCode: string): void {
    this.socket?.emit('joinRoom', { roomCode });
  }

  quickMatch(): void {
    this.socket?.emit('quickMatch', {});
  }

  leaveRoom(): void {
    this.socket?.emit('leaveRoom', {});
    this.roomCode = null;
    this.playerNumber = null;
  }

  setGameMode(mode: GameMode): void {
    this.socket?.emit('setGameMode', { mode });
  }

  // Game actions
  startGame(level?: number, mode?: GameMode): void {
    this.socket?.emit('startGame', { level, mode });
  }

  sendPlayerMove(position: { x: number; y: number }, velocity: { x: number; y: number }): void {
    this.socket?.emit('playerMove', { position, velocity });
  }

  sendPlayerDied(): void {
    this.socket?.emit('playerDied', {});
  }

  sendReachPortal(): void {
    this.socket?.emit('reachPortal', {});
  }

  // Latency check
  ping(): void {
    this.socket?.emit('ping', { timestamp: Date.now() });
  }

  // Event handling
  on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.callbacks.delete(event);
    } else {
      const callbacks = this.callbacks.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Getters
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  getRoomCode(): string | null {
    return this.roomCode;
  }

  getPlayerNumber(): number | null {
    return this.playerNumber;
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  // Cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.roomCode = null;
    this.playerNumber = null;
    this.callbacks.clear();
  }
}

// Singleton instance
let socketManagerInstance: SocketManager | null = null;

export function getSocketManager(): SocketManager {
  if (!socketManagerInstance) {
    socketManagerInstance = new SocketManager();
  }
  return socketManagerInstance;
}

export function resetSocketManager(): void {
  if (socketManagerInstance) {
    socketManagerInstance.disconnect();
    socketManagerInstance = null;
  }
}
