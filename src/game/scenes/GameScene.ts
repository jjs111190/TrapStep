import Phaser from 'phaser';
import { COLORS, TILE_SIZE } from '../config';
import { loadLevel, LevelData } from '../../data/levels';
import Player from '../entities/Player';
import { DisappearingFloor } from '../traps/DisappearingFloor';
import { MovingWall } from '../traps/MovingWall';
import { FallingBlock } from '../traps/FallingBlock';
import { FakePlatform } from '../traps/FakePlatform';
import { InvisibleSpike } from '../traps/InvisibleSpike';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private portal!: Phaser.Physics.Arcade.Sprite;
  private traps: Phaser.GameObjects.GameObject[] = [];
  private currentLevel: number = 1;
  private levelData!: LevelData;
  private startTime: number = 0;
  private deaths: number = 0;
  private timeText!: Phaser.GameObjects.Text;
  private deathText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private mobileControls: { left: boolean; right: boolean; jump: boolean } = {
    left: false,
    right: false,
    jump: false
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { level: number }) {
    this.currentLevel = data.level || 1;
    this.deaths = 0;
    this.traps = [];
  }

  create() {
    this.startTime = Date.now();

    // Load level
    this.levelData = loadLevel(this.currentLevel);

    // Background
    this.createGradientBackground();

    // Create groups
    this.platforms = this.physics.add.staticGroup();

    // Build level
    this.buildLevel();

    // Create player
    this.player = new Player(
      this,
      this.levelData.playerStart.x * TILE_SIZE + 16,
      this.levelData.playerStart.y * TILE_SIZE + 16
    );

    // Create portal
    this.portal = this.physics.add.sprite(
      this.levelData.portalPos.x * TILE_SIZE + 16,
      this.levelData.portalPos.y * TILE_SIZE + 16,
      'portal'
    );
    this.portal.setScale(1.2);

    // Add portal glow animation
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

    // Physics collisions
    this.physics.add.collider(this.player, this.platforms);

    // Portal overlap
    this.physics.add.overlap(this.player, this.portal, this.reachPortal, undefined, this);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // UI
    this.createUI();

    // Emit event for mobile controls
    this.game.events.emit('game-ready', {
      onLeft: (pressed: boolean) => { this.mobileControls.left = pressed; },
      onRight: (pressed: boolean) => { this.mobileControls.right = pressed; },
      onJump: () => { this.mobileControls.jump = true; }
    });
  }

  update() {
    if (!this.player.active) return;

    // Update player
    const left = this.cursors.left.isDown || this.wasdKeys.left.isDown || this.mobileControls.left;
    const right = this.cursors.right.isDown || this.wasdKeys.right.isDown || this.mobileControls.right;
    const jump = this.cursors.up.isDown || this.cursors.space.isDown ||
                 this.wasdKeys.up.isDown || this.wasdKeys.space.isDown ||
                 this.mobileControls.jump;

    this.player.update(left, right, jump);
    this.mobileControls.jump = false; // Reset jump

    // Update time
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.timeText.setText(`Time: ${elapsed}s`);

    // Check if player fell off
    if (this.player.y > 650) {
      this.killPlayer();
    }
  }

  createGradientBackground() {
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

  buildLevel() {
    const { tiles } = this.levelData;

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = tiles[y][x];
        const posX = x * TILE_SIZE;
        const posY = y * TILE_SIZE;

        switch (tile) {
          case 1: // Platform
            this.platforms.create(posX + 16, posY + 16, 'platform');
            break;
          case 2: // Disappearing floor
            const disappearing = new DisappearingFloor(this, posX + 16, posY + 16);
            this.traps.push(disappearing);
            this.platforms.add(disappearing);
            break;
          case 3: // Falling block
            const falling = new FallingBlock(this, posX + 16, posY + 16);
            this.traps.push(falling);
            this.platforms.add(falling);
            this.physics.add.overlap(this.player, falling, () => falling.trigger(), undefined, this);
            break;
          case 4: // Fake platform
            const fake = new FakePlatform(this, posX + 16, posY + 16);
            this.traps.push(fake);
            this.physics.add.overlap(this.player, fake, () => this.killPlayer(), undefined, this);
            break;
          case 5: // Invisible spike (appears when near)
            const spike = new InvisibleSpike(this, posX + 16, posY + 16, this.player);
            this.traps.push(spike);
            this.physics.add.overlap(this.player, spike, () => {
              if (spike.isVisible()) this.killPlayer();
            }, undefined, this);
            break;
        }
      }
    }

    // Add moving walls
    if (this.levelData.movingWalls) {
      for (const wallData of this.levelData.movingWalls) {
        const wall = new MovingWall(
          this,
          wallData.x * TILE_SIZE + 16,
          wallData.y * TILE_SIZE + 16,
          wallData.moveX,
          wallData.moveY,
          wallData.speed
        );
        this.traps.push(wall);
        this.physics.add.overlap(this.player, wall, () => this.killPlayer(), undefined, this);
      }
    }
  }

  createUI() {
    const width = this.cameras.main.width;

    // Level number
    this.levelText = this.add.text(16, 16, `Level ${this.currentLevel}`, {
      fontSize: '20px',
      color: '#FFF4E6',
      fontStyle: 'bold'
    });

    // Time
    this.timeText = this.add.text(width / 2, 16, 'Time: 0s', {
      fontSize: '18px',
      color: '#FFF4E6'
    });
    this.timeText.setOrigin(0.5, 0);

    // Deaths
    this.deathText = this.add.text(width - 16, 16, `Deaths: ${this.deaths}`, {
      fontSize: '18px',
      color: '#FF7F7F'
    });
    this.deathText.setOrigin(1, 0);

    // Restart hint
    const restartHint = this.add.text(width / 2, 50, 'Press R to restart', {
      fontSize: '14px',
      color: '#FFF4E6',
      alpha: 0.6
    });
    restartHint.setOrigin(0.5, 0);

    // R key to restart
    this.input.keyboard!.on('keydown-R', () => {
      this.restartLevel();
    });

    // ESC key to menu
    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }

  killPlayer() {
    if (!this.player.active) return;

    this.player.die();
    this.deaths++;
    this.deathText.setText(`Deaths: ${this.deaths}`);

    // Add death particle effect
    this.createDeathEffect(this.player.x, this.player.y);

    // Restart after delay
    this.time.delayedCall(800, () => {
      this.restartLevel();
    });
  }

  createDeathEffect(x: number, y: number) {
    const particles = this.add.particles(x, y, 'player', {
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 10
    });

    this.time.delayedCall(700, () => {
      particles.destroy();
    });
  }

  restartLevel() {
    this.scene.restart({ level: this.currentLevel });
  }

  reachPortal() {
    if (!this.player.active) return;

    this.player.setActive(false);

    // Calculate stats
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    let stars = 3;

    // Star calculation based on time and deaths
    if (timeTaken > 60 || this.deaths > 5) stars = 2;
    if (timeTaken > 120 || this.deaths > 10) stars = 1;

    // Portal effect
    this.tweens.add({
      targets: this.player,
      x: this.portal.x,
      y: this.portal.y,
      scale: 0,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start('GameOverScene', {
          level: this.currentLevel,
          time: timeTaken,
          deaths: this.deaths,
          stars: stars,
          completed: true
        });
      }
    });
  }
}
