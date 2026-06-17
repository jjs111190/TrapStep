import Phaser from 'phaser';
import { COLORS } from '../config';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(COLORS.navy, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#FFF4E6'
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(COLORS.coral, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Here we would load assets if we had external ones
    // For now, we'll create graphics programmatically
  }

  create() {
    // Generate graphics for player and objects
    this.createPlayerGraphic();
    this.createPlayer2Graphic();
    this.createPortalGraphic();
    this.createTileGraphics();

    this.scene.start('MenuScene');
  }

  createPlayerGraphic() {
    // Create a small round robot character (16x16) - Player 1 (Coral)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Body (circle)
    graphics.fillStyle(COLORS.cream, 1);
    graphics.fillCircle(8, 8, 7);

    // Eyes
    graphics.fillStyle(COLORS.navy, 1);
    graphics.fillCircle(5, 6, 2);
    graphics.fillCircle(11, 6, 2);

    // Antenna
    graphics.lineStyle(2, COLORS.coral, 1);
    graphics.lineBetween(8, 2, 8, 0);
    graphics.fillStyle(COLORS.coral, 1);
    graphics.fillCircle(8, 0, 2);

    graphics.generateTexture('player', 16, 16);
    graphics.destroy();
  }

  createPlayer2Graphic() {
    // Create a small round robot character (16x16) - Player 2 (Mint)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Body (circle)
    graphics.fillStyle(COLORS.cream, 1);
    graphics.fillCircle(8, 8, 7);

    // Eyes
    graphics.fillStyle(COLORS.navy, 1);
    graphics.fillCircle(5, 6, 2);
    graphics.fillCircle(11, 6, 2);

    // Antenna (mint color)
    graphics.lineStyle(2, 0x7FFFD4, 1); // Mint/Aquamarine
    graphics.lineBetween(8, 2, 8, 0);
    graphics.fillStyle(0x7FFFD4, 1);
    graphics.fillCircle(8, 0, 2);

    graphics.generateTexture('player2', 16, 16);
    graphics.destroy();
  }

  createPortalGraphic() {
    // Create a glowing portal (32x32)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Outer glow
    graphics.fillStyle(COLORS.gold, 0.3);
    graphics.fillCircle(16, 16, 15);

    // Middle ring
    graphics.fillStyle(COLORS.gold, 0.6);
    graphics.fillCircle(16, 16, 12);

    // Inner core
    graphics.fillStyle(COLORS.gold, 1);
    graphics.fillCircle(16, 16, 8);

    graphics.generateTexture('portal', 32, 32);
    graphics.destroy();
  }

  createTileGraphics() {
    // Platform tile
    const platformGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    platformGraphics.fillStyle(COLORS.cream, 1);
    platformGraphics.fillRect(0, 0, 32, 32);
    platformGraphics.lineStyle(2, COLORS.navy, 0.3);
    platformGraphics.strokeRect(0, 0, 32, 32);
    platformGraphics.generateTexture('platform', 32, 32);
    platformGraphics.destroy();

    // Trap tile (looks same as platform initially)
    const trapGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    trapGraphics.fillStyle(COLORS.cream, 1);
    trapGraphics.fillRect(0, 0, 32, 32);
    trapGraphics.lineStyle(2, COLORS.navy, 0.3);
    trapGraphics.strokeRect(0, 0, 32, 32);
    trapGraphics.generateTexture('trap', 32, 32);
    trapGraphics.destroy();

    // Moving wall
    const wallGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    wallGraphics.fillStyle(COLORS.danger, 1);
    wallGraphics.fillRect(0, 0, 32, 32);
    wallGraphics.lineStyle(2, COLORS.navy, 0.5);
    wallGraphics.strokeRect(0, 0, 32, 32);
    wallGraphics.generateTexture('wall', 32, 32);
    wallGraphics.destroy();

    // Spike
    const spikeGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    spikeGraphics.fillStyle(COLORS.danger, 1);
    spikeGraphics.fillTriangle(16, 0, 0, 32, 32, 32);
    spikeGraphics.generateTexture('spike', 32, 32);
    spikeGraphics.destroy();
  }
}
