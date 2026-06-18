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
    progressBox.fillStyle(COLORS.black, 1);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#00FF41'
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(COLORS.green, 1);
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
    // Create pixel art person (16x16) - Player 1 (Green)
    const graphics = this.make.graphics({});

    // Head
    graphics.fillStyle(COLORS.green, 1);
    graphics.fillRect(5, 2, 6, 4);

    // Eyes
    graphics.fillStyle(COLORS.black, 1);
    graphics.fillRect(6, 3, 1, 1);
    graphics.fillRect(9, 3, 1, 1);

    // Body
    graphics.fillStyle(COLORS.green, 1);
    graphics.fillRect(5, 6, 6, 4);

    // Arms
    graphics.fillRect(3, 7, 2, 2);
    graphics.fillRect(11, 7, 2, 2);

    // Legs
    graphics.fillRect(6, 10, 2, 4);
    graphics.fillRect(8, 10, 2, 4);

    graphics.generateTexture('player', 16, 16);
    graphics.destroy();
  }

  createPlayer2Graphic() {
    // Create pixel art person (16x16) - Player 2 (Yellow)
    const graphics = this.make.graphics({});

    // Head
    graphics.fillStyle(COLORS.yellow, 1);
    graphics.fillRect(5, 2, 6, 4);

    // Eyes
    graphics.fillStyle(COLORS.black, 1);
    graphics.fillRect(6, 3, 1, 1);
    graphics.fillRect(9, 3, 1, 1);

    // Body
    graphics.fillStyle(COLORS.yellow, 1);
    graphics.fillRect(5, 6, 6, 4);

    // Arms
    graphics.fillRect(3, 7, 2, 2);
    graphics.fillRect(11, 7, 2, 2);

    // Legs
    graphics.fillRect(6, 10, 2, 4);
    graphics.fillRect(8, 10, 2, 4);

    graphics.generateTexture('player2', 16, 16);
    graphics.destroy();
  }

  createPortalGraphic() {
    // Create a simple square portal (32x32)
    const graphics = this.make.graphics({});

    // Simple solid square - yellow/white for visibility
    graphics.fillStyle(COLORS.yellow, 1);
    graphics.fillRect(4, 4, 24, 24);

    // Inner white square for depth
    graphics.fillStyle(COLORS.white, 1);
    graphics.fillRect(10, 10, 12, 12);

    graphics.generateTexture('portal', 32, 32);
    graphics.destroy();
  }

  createTileGraphics() {
    // Platform tile - simple flat green
    const platformGraphics = this.make.graphics({});
    platformGraphics.fillStyle(COLORS.green, 1);
    platformGraphics.fillRect(0, 0, 32, 32);
    platformGraphics.generateTexture('platform', 32, 32);
    platformGraphics.destroy();

    // Trap tile (looks same as platform initially)
    const trapGraphics = this.make.graphics({});
    trapGraphics.fillStyle(COLORS.green, 1);
    trapGraphics.fillRect(0, 0, 32, 32);
    trapGraphics.generateTexture('trap', 32, 32);
    trapGraphics.destroy();

    // Moving wall - red danger
    const wallGraphics = this.make.graphics({});
    wallGraphics.fillStyle(COLORS.red, 1);
    wallGraphics.fillRect(0, 0, 32, 32);
    wallGraphics.generateTexture('wall', 32, 32);
    wallGraphics.destroy();

    // Spike - simple red triangle
    const spikeGraphics = this.make.graphics({});
    spikeGraphics.fillStyle(COLORS.red, 1);
    spikeGraphics.fillTriangle(16, 0, 0, 32, 32, 32);
    spikeGraphics.generateTexture('spike', 32, 32);
    spikeGraphics.destroy();
  }
}
