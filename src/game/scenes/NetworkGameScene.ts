import Phaser from 'phaser';
import { COLORS, TILE_SIZE } from '../config';
import { loadLevel, LevelData } from '../../data/levels';
import Player from '../entities/Player';
import Player2 from '../entities/Player2';
import { DisappearingFloor } from '../traps/DisappearingFloor';
import { MovingWall } from '../traps/MovingWall';
import { FallingBlock } from '../traps/FallingBlock';
import { FakePlatform } from '../traps/FakePlatform';
import { InvisibleSpike } from '../traps/InvisibleSpike';
import { getSocketManager } from '../../network/SocketManager';

interface InitData {
  roomCode: string;
  isHost: boolean;
  level: number;
  mode: 'coop' | 'race';
}

export default class NetworkGameScene extends Phaser.Scene {
  private socketManager = getSocketManager();

  // Game state
  private roomCode!: string;
  private isHost!: boolean;
  private gameMode!: 'coop' | 'race';
  private currentLevel: number = 1;
  private levelData!: LevelData;

  // Players
  private localPlayer!: Player | Player2;
  private remotePlayer!: Player | Player2;
  private localPlayerNumber: number = 1; // 1 or 2

  // Game objects
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private portal!: Phaser.Physics.Arcade.Sprite;
  private traps: Phaser.GameObjects.GameObject[] = [];

  // State tracking
  private localReachedPortal: boolean = false;
  private remoteReachedPortal: boolean = false;
  private localDied: boolean = false;
  private gameEnded: boolean = false;

  // UI
  private statusText!: Phaser.GameObjects.Text;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private mobileControls: { left: boolean; right: boolean; jump: boolean } = {
    left: false,
    right: false,
    jump: false
  };

  constructor() {
    super({ key: 'NetworkGameScene' });
  }

  init(data: InitData): void {
    this.roomCode = data.roomCode;
    this.isHost = data.isHost;
    this.currentLevel = data.level || 1;
    this.gameMode = data.mode || 'coop';
    this.localPlayerNumber = this.isHost ? 1 : 2;
    this.localReachedPortal = false;
    this.remoteReachedPortal = false;
    this.localDied = false;
    this.gameEnded = false;
    this.traps = [];
  }

  create(): void {
    // Load level
    this.levelData = loadLevel(this.currentLevel);

    // Background
    this.createGradientBackground();

    // Create groups
    this.platforms = this.physics.add.staticGroup();

    // Build level
    this.buildLevel();

    // Create players
    this.createPlayers();

    // Create portal
    this.createPortal();

    // Setup physics
    this.setupPhysics();

    // Input
    this.setupInput();

    // UI
    this.createUI();

    // Setup network listeners
    this.setupNetworkListeners();

    // Mobile controls
    this.setupMobileControls();
  }

  update(): void {
    if (this.gameEnded) return;

    // Update local player
    this.updateLocalPlayer();

    // Send position updates to server (throttled by client-side)
    if (this.time.now % 50 === 0) { // ~20 updates per second
      const body = this.localPlayer.body as Phaser.Physics.Arcade.Body;
      this.socketManager.sendPlayerMove(
        { x: this.localPlayer.x, y: this.localPlayer.y },
        { x: body.velocity.x, y: body.velocity.y }
      );
    }

    // Check if local player fell off
    if (this.localPlayer.y > 650 && !this.localDied) {
      this.onLocalPlayerDeath();
    }
  }

  private createGradientBackground(): void {
    const graphics = this.add.graphics();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    for (let i = 0; i < height; i += 10) {
      const ratio = i / height;
      const r = Math.floor(255 + (45 - 255) * ratio);
      const g = Math.floor(127 + (62 - 127) * ratio);
      const b = Math.floor(127 + (80 - 127) * ratio);
      const color = Phaser.Display.Color.GetColor(r, g, b);
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, i, width, 10);
    }
  }

  private buildLevel(): void {
    const tiles = this.levelData.tiles;

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tileType = tiles[y][x];
        const worldX = x * TILE_SIZE;
        const worldY = y * TILE_SIZE;

        switch (tileType) {
          case 1: // Normal platform
            const platform = this.platforms.create(worldX + 16, worldY + 16, 'platform');
            platform.setTint(COLORS.coral);
            break;

          case 2: // Disappearing floor
            const disappearing = new DisappearingFloor(this, worldX + 16, worldY + 16);
            this.traps.push(disappearing);
            // DisappearingFloor automatically detects player contact
            break;

          case 3: // Falling block
            const falling = new FallingBlock(this, worldX + 16, worldY + 16);
            this.traps.push(falling);
            this.physics.add.overlap(this.localPlayer, falling, () => falling.trigger(), undefined, this);
            break;

          case 4: // Fake platform
            const fake = new FakePlatform(this, worldX + 16, worldY + 16);
            this.traps.push(fake);
            this.physics.add.overlap(
              this.localPlayer,
              fake,
              () => {
                if (!this.localDied) this.onLocalPlayerDeath();
              },
              undefined,
              this
            );
            break;

          case 5: // Invisible spike
            const spike = new InvisibleSpike(this, worldX + 16, worldY + 16, this.localPlayer);
            this.traps.push(spike);
            this.physics.add.overlap(
              this.localPlayer,
              spike,
              () => {
                spike.revealManually();
                if (spike.isRevealed() && !this.localDied) {
                  this.onLocalPlayerDeath();
                }
              },
              undefined,
              this
            );
            break;
        }
      }
    }

    // Moving walls
    if (this.levelData.movingWalls) {
      this.levelData.movingWalls.forEach((wallData) => {
        const wall = new MovingWall(
          this,
          wallData.x * TILE_SIZE + 16,
          wallData.y * TILE_SIZE + 16,
          wallData.moveX * TILE_SIZE,
          wallData.moveY * TILE_SIZE,
          wallData.speed
        );
        this.traps.push(wall);
        this.physics.add.overlap(
          this.localPlayer,
          wall,
          () => {
            if (!this.localDied) this.onLocalPlayerDeath();
          },
          undefined,
          this
        );
      });
    }
  }

  private createPlayers(): void {
    const startX = this.levelData.playerStart.x * TILE_SIZE + 16;
    const startY = this.levelData.playerStart.y * TILE_SIZE + 16;

    if (this.localPlayerNumber === 1) {
      this.localPlayer = new Player(this, startX, startY);
      this.remotePlayer = new Player2(this, startX + 50, startY);
    } else {
      this.localPlayer = new Player2(this, startX, startY);
      this.remotePlayer = new Player(this, startX + 50, startY);
    }
  }

  private createPortal(): void {
    this.portal = this.physics.add.sprite(
      this.levelData.portalPos.x * TILE_SIZE + 16,
      this.levelData.portalPos.y * TILE_SIZE + 16,
      'portal'
    );
    this.portal.setScale(1.2);

    // Portal animations
    this.tweens.add({
      targets: this.portal,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: this.portal,
      scale: 1.3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private setupPhysics(): void {
    // Local player collisions
    this.physics.add.collider(this.localPlayer, this.platforms);
    this.physics.add.overlap(this.localPlayer, this.portal, () => this.onLocalReachPortal(), undefined, this);

    // Remote player collisions (non-interactive)
    this.physics.add.collider(this.remotePlayer, this.platforms);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  private createUI(): void {
    const { width } = this.cameras.main;

    // Room code
    this.add.text(width / 2, 20, `Room: ${this.roomCode}`, {
      fontSize: '20px',
      color: '#4ECDC4',
      fontFamily: 'Arial',
      backgroundColor: '#00000080',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5, 0).setScrollFactor(0);

    // Game mode
    const modeLabel = this.gameMode === 'coop' ? 'CO-OP' : 'RACE';
    this.add.text(width / 2, 50, modeLabel, {
      fontSize: '18px',
      color: '#FFE66D',
      fontFamily: 'Arial',
      backgroundColor: '#00000080',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5, 0).setScrollFactor(0);

    // Status text
    this.statusText = this.add.text(width / 2, 80, '', {
      fontSize: '16px',
      color: '#ECF0F1',
      fontFamily: 'Arial',
      backgroundColor: '#00000080',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5, 0).setScrollFactor(0);
  }

  private setupNetworkListeners(): void {
    // Remote player position updates
    this.socketManager.on('playerMove', (data: { playerNumber: number; position: { x: number; y: number }; velocity: { x: number; y: number } }) => {
      if (data.playerNumber !== this.localPlayerNumber) {
        this.remotePlayer.setPosition(data.position.x, data.position.y);
        const body = this.remotePlayer.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(data.velocity.x, data.velocity.y);
      }
    });

    // Remote player died
    this.socketManager.on('playerDied', (data: { playerNumber: number }) => {
      if (data.playerNumber !== this.localPlayerNumber) {
        this.remotePlayer.die();
        this.statusText.setText('Partner died!');

        if (this.gameMode === 'coop') {
          this.onCoopRestart();
        }
      }
    });

    // Remote player reached portal
    this.socketManager.on('playerReachedPortal', (data: { playerNumber: number }) => {
      if (data.playerNumber !== this.localPlayerNumber) {
        this.remoteReachedPortal = true;
        this.checkWinCondition();
      }
    });

    // Game over event
    this.socketManager.on('gameOver', (data: { winner?: number; success?: boolean }) => {
      this.gameEnded = true;

      if (this.gameMode === 'race') {
        if (data.winner === this.localPlayerNumber) {
          this.showVictory('YOU WIN!');
        } else {
          this.showDefeat('YOU LOSE!');
        }
      } else {
        if (data.success) {
          this.showVictory('LEVEL COMPLETE!');
        }
      }
    });
  }

  private setupMobileControls(): void {
    this.game.events.emit('game-ready', {
      onLeft: (pressed: boolean) => { this.mobileControls.left = pressed; },
      onRight: (pressed: boolean) => { this.mobileControls.right = pressed; },
      onJump: () => { this.mobileControls.jump = true; }
    });
  }

  private updateLocalPlayer(): void {
    if (!this.localPlayer.active || this.localDied) return;

    const left = this.cursors.left.isDown || this.wasdKeys.left.isDown || this.mobileControls.left;
    const right = this.cursors.right.isDown || this.wasdKeys.right.isDown || this.mobileControls.right;
    const jump = this.cursors.up.isDown || this.cursors.space.isDown ||
                 this.wasdKeys.up.isDown || this.wasdKeys.space.isDown ||
                 this.mobileControls.jump;

    this.localPlayer.update(left, right, jump);
    this.mobileControls.jump = false;
  }

  private onLocalPlayerDeath(): void {
    this.localDied = true;
    this.localPlayer.die();
    this.socketManager.sendPlayerDied();
    this.statusText.setText('You died!');

    if (this.gameMode === 'coop') {
      this.onCoopRestart();
    } else {
      // In race mode, you just lose
      this.showDefeat('YOU DIED!');
    }
  }

  private onLocalReachPortal(): void {
    if (this.localReachedPortal || this.localDied) return;

    this.localReachedPortal = true;
    this.socketManager.sendReachPortal();
    this.statusText.setText('Reached portal!');

    this.checkWinCondition();
  }

  private checkWinCondition(): void {
    if (this.gameMode === 'coop') {
      // Both must reach portal
      if (this.localReachedPortal && this.remoteReachedPortal) {
        this.gameEnded = true;
        this.showVictory('LEVEL COMPLETE!');
      } else if (this.localReachedPortal) {
        this.statusText.setText('Waiting for partner...');
      }
    } else {
      // Race mode - first to reach wins
      if (this.localReachedPortal) {
        this.gameEnded = true;
        this.showVictory('YOU WIN!');
      }
    }
  }

  private onCoopRestart(): void {
    // In co-op mode, restart both players when one dies
    this.time.delayedCall(2000, () => {
      if (this.gameEnded) return;

      const startX = this.levelData.playerStart.x * TILE_SIZE + 16;
      const startY = this.levelData.playerStart.y * TILE_SIZE + 16;

      // Revive local player if dead
      if (this.localDied && this.localPlayer instanceof Player2) {
        this.localPlayer.revive(startX, startY);
      } else if (this.localDied) {
        this.localPlayer.setPosition(startX, startY);
        this.localPlayer.setActive(true);
        this.localPlayer.setVisible(true);
        this.localPlayer.setVelocity(0, 0);
      }

      // Remote player will also restart via server sync
      this.localDied = false;
      this.localReachedPortal = false;
      this.remoteReachedPortal = false;
      this.statusText.setText('Restarting...');
    });
  }

  private showVictory(message: string): void {
    const { width, height } = this.cameras.main;

    // Dim background
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setScrollFactor(0);

    // Victory text
    const victoryText = this.add.text(width / 2, height / 2 - 60, message, {
      fontSize: '64px',
      color: '#00D2FF',
      fontFamily: 'Arial Black',
      stroke: '#2C3E50',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0);

    // Animate
    this.tweens.add({
      targets: victoryText,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Return button
    this.time.delayedCall(3000, () => {
      const returnBtn = this.add.text(width / 2, height / 2 + 60, 'Return to Lobby', {
        fontSize: '32px',
        color: '#4ECDC4',
        fontFamily: 'Arial',
        backgroundColor: '#2C3E50',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

      returnBtn.on('pointerdown', () => {
        this.socketManager.disconnect();
        this.scene.start('LobbyScene');
      });
    });
  }

  private showDefeat(message: string): void {
    const { width, height } = this.cameras.main;

    // Dim background
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setScrollFactor(0);

    // Defeat text
    this.add.text(width / 2, height / 2 - 60, message, {
      fontSize: '64px',
      color: '#F38181',
      fontFamily: 'Arial Black',
      stroke: '#2C3E50',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0);

    // Return button
    this.time.delayedCall(3000, () => {
      const returnBtn = this.add.text(width / 2, height / 2 + 60, 'Return to Lobby', {
        fontSize: '32px',
        color: '#4ECDC4',
        fontFamily: 'Arial',
        backgroundColor: '#2C3E50',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

      returnBtn.on('pointerdown', () => {
        this.socketManager.disconnect();
        this.scene.start('LobbyScene');
      });
    });
  }

  shutdown(): void {
    // Clean up socket listeners
    this.socketManager.off('playerMove');
    this.socketManager.off('playerDied');
    this.socketManager.off('playerReachedPortal');
    this.socketManager.off('gameOver');
  }
}
