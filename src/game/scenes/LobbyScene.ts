import Phaser from 'phaser';
import { getSocketManager } from '../../network/SocketManager';

export default class LobbyScene extends Phaser.Scene {
  private socketManager = getSocketManager();
  private currentRoomCode: string | null = null;
  private isHost: boolean = false;
  private playerCount: number = 0;
  private selectedMode: 'coop' | 'race' = 'coop';

  // UI elements
  private createRoomBtn!: Phaser.GameObjects.Container;
  private joinRoomBtn!: Phaser.GameObjects.Container;
  private quickMatchBtn!: Phaser.GameObjects.Container;
  private backBtn!: Phaser.GameObjects.Container;

  // Room UI
  private roomContainer!: Phaser.GameObjects.Container;
  private roomCodeText!: Phaser.GameObjects.Text;
  private waitingText!: Phaser.GameObjects.Text;
  private modeCoopBtn!: Phaser.GameObjects.Container;
  private modeRaceBtn!: Phaser.GameObjects.Container;
  private startGameBtn!: Phaser.GameObjects.Container;
  private leaveRoomBtn!: Phaser.GameObjects.Container;

  // Join room UI
  private joinContainer!: Phaser.GameObjects.Container;
  private roomCodeInput!: HTMLInputElement;

  constructor() {
    super({ key: 'LobbyScene' });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2C3E50);

    // Title
    this.add.text(width / 2, 80, 'ONLINE MULTIPLAYER', {
      fontSize: '48px',
      color: '#FF6B6B',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5);

    // Create main menu buttons
    this.createMainMenu();

    // Create room UI (hidden initially)
    this.createRoomUI();

    // Create join room UI (hidden initially)
    this.createJoinUI();

    // Setup socket listeners
    this.setupSocketListeners();

    // Show main menu by default
    this.showMainMenu();
  }

  private createMainMenu(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const startY = height / 2 - 60;
    const spacing = 100;

    // Create Room Button
    this.createRoomBtn = this.createButton(centerX, startY, 'CREATE ROOM', 0x4ECDC4, () => {
      this.socketManager.createRoom(this.selectedMode);
    });

    // Join Room Button
    this.joinRoomBtn = this.createButton(centerX, startY + spacing, 'JOIN ROOM', 0x95E1D3, () => {
      this.showJoinMenu();
    });

    // Quick Match Button
    this.quickMatchBtn = this.createButton(centerX, startY + spacing * 2, 'QUICK MATCH', 0xFFE66D, () => {
      this.socketManager.quickMatch();
    });

    // Back Button
    this.backBtn = this.createButton(centerX, startY + spacing * 3, 'BACK TO MENU', 0xF38181, () => {
      this.scene.start('MenuScene');
    });
  }

  private createRoomUI(): void {
    const { width } = this.cameras.main;
    this.roomContainer = this.add.container(0, 0).setVisible(false);

    // Room code display
    const roomCodeBg = this.add.rectangle(width / 2, 200, 400, 100, 0x34495E, 0.9);
    this.roomCodeText = this.add.text(width / 2, 180, 'Room Code:', {
      fontSize: '24px',
      color: '#ECF0F1',
    }).setOrigin(0.5);

    const roomCodeValue = this.add.text(width / 2, 220, '', {
      fontSize: '48px',
      color: '#4ECDC4',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5);
    roomCodeValue.setName('roomCodeValue');

    // Waiting text
    this.waitingText = this.add.text(width / 2, 320, 'Waiting for player...', {
      fontSize: '28px',
      color: '#95E1D3',
    }).setOrigin(0.5);

    // Mode selection
    const modeLabel = this.add.text(width / 2, 400, 'Game Mode:', {
      fontSize: '24px',
      color: '#ECF0F1',
    }).setOrigin(0.5);

    this.modeCoopBtn = this.createButton(width / 2 - 120, 460, 'CO-OP', 0x4ECDC4, () => {
      this.selectMode('coop');
    });

    this.modeRaceBtn = this.createButton(width / 2 + 120, 460, 'RACE', 0x95E1D3, () => {
      this.selectMode('race');
    });

    // Start game button (host only)
    this.startGameBtn = this.createButton(width / 2, 560, 'START GAME', 0x00D2FF, () => {
      this.socketManager.startGame();
    }).setVisible(false);

    // Leave room button
    this.leaveRoomBtn = this.createButton(width / 2, 660, 'LEAVE ROOM', 0xF38181, () => {
      this.leaveRoom();
    });

    this.roomContainer.add([
      roomCodeBg,
      this.roomCodeText,
      roomCodeValue,
      this.waitingText,
      modeLabel,
      this.modeCoopBtn,
      this.modeRaceBtn,
      this.startGameBtn,
      this.leaveRoomBtn,
    ]);
  }

  private createJoinUI(): void {
    const { width, height } = this.cameras.main;
    this.joinContainer = this.add.container(0, 0).setVisible(false);

    // Join room background
    const joinBg = this.add.rectangle(width / 2, height / 2, 500, 300, 0x34495E, 0.95);

    // Title
    const joinTitle = this.add.text(width / 2, height / 2 - 100, 'Enter Room Code', {
      fontSize: '32px',
      color: '#4ECDC4',
    }).setOrigin(0.5);

    // Create HTML input for room code
    this.roomCodeInput = document.createElement('input');
    this.roomCodeInput.type = 'text';
    this.roomCodeInput.placeholder = 'ABC123';
    this.roomCodeInput.maxLength = 6;
    this.roomCodeInput.style.position = 'absolute';
    this.roomCodeInput.style.left = `${width / 2 - 100}px`;
    this.roomCodeInput.style.top = `${height / 2 - 20}px`;
    this.roomCodeInput.style.width = '200px';
    this.roomCodeInput.style.height = '50px';
    this.roomCodeInput.style.fontSize = '24px';
    this.roomCodeInput.style.textAlign = 'center';
    this.roomCodeInput.style.textTransform = 'uppercase';
    this.roomCodeInput.style.border = '3px solid #4ECDC4';
    this.roomCodeInput.style.borderRadius = '8px';
    this.roomCodeInput.style.backgroundColor = '#2C3E50';
    this.roomCodeInput.style.color = '#ECF0F1';
    this.roomCodeInput.style.display = 'none';
    document.body.appendChild(this.roomCodeInput);

    // Join button
    const joinBtn = this.createButton(width / 2 - 100, height / 2 + 80, 'JOIN', 0x4ECDC4, () => {
      const code = this.roomCodeInput.value.trim().toUpperCase();
      if (code.length === 6) {
        this.socketManager.joinRoom(code);
      }
    });

    // Cancel button
    const cancelBtn = this.createButton(width / 2 + 100, height / 2 + 80, 'CANCEL', 0xF38181, () => {
      this.showMainMenu();
    });

    this.joinContainer.add([joinBg, joinTitle, joinBtn, cancelBtn]);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 300, 60, color, 0.9)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.setFillStyle(color, 1);
        bg.setScale(1.05);
      })
      .on('pointerout', () => {
        bg.setFillStyle(color, 0.9);
        bg.setScale(1);
      })
      .on('pointerdown', onClick);

    const label = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: '#2C3E50',
      fontFamily: 'Arial Black',
    }).setOrigin(0.5);

    container.add([bg, label]);
    return container;
  }

  private setupSocketListeners(): void {
    // Room created successfully
    this.socketManager.on('roomCreated', (data: { roomCode: string }) => {
      this.currentRoomCode = data.roomCode;
      this.isHost = true;
      this.playerCount = 1;
      this.showRoomUI();
      this.updateRoomCode(data.roomCode);
      this.updateWaitingText();
    });

    // Joined room successfully
    this.socketManager.on('roomJoined', (data: { roomCode: string; playerNumber: number; mode: 'coop' | 'race' }) => {
      this.currentRoomCode = data.roomCode;
      this.isHost = false;
      this.playerCount = 2;
      this.selectedMode = data.mode;
      this.showRoomUI();
      this.updateRoomCode(data.roomCode);
      this.updateWaitingText();
      this.updateModeButtons();
    });

    // Player joined the room
    this.socketManager.on('playerJoined', () => {
      this.playerCount = 2;
      this.updateWaitingText();
      if (this.isHost) {
        this.startGameBtn.setVisible(true);
      }
    });

    // Player left the room
    this.socketManager.on('playerLeft', () => {
      this.playerCount = 1;
      this.updateWaitingText();
      if (this.isHost) {
        this.startGameBtn.setVisible(false);
      }
    });

    // Game started
    this.socketManager.on('gameStarted', (data: { level: number; mode: 'coop' | 'race' }) => {
      this.scene.start('NetworkGameScene', {
        roomCode: this.currentRoomCode,
        isHost: this.isHost,
        level: data.level,
        mode: data.mode,
      });
    });

    // Errors
    this.socketManager.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      alert(data.message);
      this.showMainMenu();
    });
  }

  private selectMode(mode: 'coop' | 'race'): void {
    if (!this.isHost) return; // Only host can change mode

    this.selectedMode = mode;
    this.socketManager.setGameMode(mode);
    this.updateModeButtons();
  }

  private updateModeButtons(): void {
    // Update visual state of mode buttons
    const coopBg = this.modeCoopBtn.getAt(0) as Phaser.GameObjects.Rectangle;
    const raceBg = this.modeRaceBtn.getAt(0) as Phaser.GameObjects.Rectangle;

    if (this.selectedMode === 'coop') {
      coopBg.setFillStyle(0x00D2FF, 1);
      raceBg.setFillStyle(0x95E1D3, 0.5);
    } else {
      coopBg.setFillStyle(0x4ECDC4, 0.5);
      raceBg.setFillStyle(0x00D2FF, 1);
    }

    // Disable mode selection for non-host
    if (!this.isHost) {
      coopBg.disableInteractive();
      raceBg.disableInteractive();
    }
  }

  private updateRoomCode(code: string): void {
    const roomCodeValue = this.roomContainer.getByName('roomCodeValue') as Phaser.GameObjects.Text;
    if (roomCodeValue) {
      roomCodeValue.setText(code);
    }
  }

  private updateWaitingText(): void {
    if (this.playerCount === 1) {
      this.waitingText.setText('Waiting for player...');
      this.waitingText.setColor('#95E1D3');
    } else {
      this.waitingText.setText('2 Players Ready!');
      this.waitingText.setColor('#00D2FF');
    }
  }

  private showMainMenu(): void {
    this.createRoomBtn.setVisible(true);
    this.joinRoomBtn.setVisible(true);
    this.quickMatchBtn.setVisible(true);
    this.backBtn.setVisible(true);
    this.roomContainer.setVisible(false);
    this.joinContainer.setVisible(false);
    this.roomCodeInput.style.display = 'none';
  }

  private showJoinMenu(): void {
    this.createRoomBtn.setVisible(false);
    this.joinRoomBtn.setVisible(false);
    this.quickMatchBtn.setVisible(false);
    this.backBtn.setVisible(false);
    this.roomContainer.setVisible(false);
    this.joinContainer.setVisible(true);
    this.roomCodeInput.style.display = 'block';
    this.roomCodeInput.value = '';
    this.roomCodeInput.focus();
  }

  private showRoomUI(): void {
    this.createRoomBtn.setVisible(false);
    this.joinRoomBtn.setVisible(false);
    this.quickMatchBtn.setVisible(false);
    this.backBtn.setVisible(false);
    this.roomContainer.setVisible(true);
    this.joinContainer.setVisible(false);
    this.roomCodeInput.style.display = 'none';
    this.updateModeButtons();
  }

  private leaveRoom(): void {
    this.socketManager.disconnect();
    this.currentRoomCode = null;
    this.isHost = false;
    this.playerCount = 0;
    this.showMainMenu();
  }

  shutdown(): void {
    // Clean up HTML input
    if (this.roomCodeInput && this.roomCodeInput.parentNode) {
      this.roomCodeInput.parentNode.removeChild(this.roomCodeInput);
    }
  }
}
