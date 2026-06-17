import Phaser from 'phaser';
import { COLORS } from '../config';
import { getProgress, getTotalLevels } from '../../utils/storage';
import { getSocketManager } from '../../network/SocketManager';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background gradient effect (simulated with multiple rectangles)
    this.createGradientBackground();

    // Title
    const title = this.add.text(width / 2, 150, 'TrapStep', {
      fontSize: '72px',
      color: '#FFF4E6',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, 220, 'Watch your step...', {
      fontSize: '24px',
      color: '#FF7F7F',
      fontStyle: 'italic'
    });
    subtitle.setOrigin(0.5);

    // Progress info
    const progress = getProgress();
    const totalLevels = getTotalLevels();
    const completedLevels = Object.keys(progress).filter(
      key => progress[parseInt(key)]?.completed
    ).length;

    const progressText = this.add.text(
      width / 2,
      300,
      `Progress: ${completedLevels}/${totalLevels} levels`,
      {
        fontSize: '18px',
        color: '#FFF4E6'
      }
    );
    progressText.setOrigin(0.5);

    // Play button
    const playButton = this.createButton(width / 2, 380, 'PLAY', () => {
      this.scene.start('GameScene', { level: 1 });
    });

    // Level Select button
    const levelSelectButton = this.createButton(width / 2, 460, 'LEVEL SELECT', () => {
      this.showLevelSelect();
    });

    // Online Multiplayer button
    const onlineButton = this.createButton(width / 2, 540, 'ONLINE MULTIPLAYER', () => {
      const socketManager = getSocketManager();
      socketManager.connect().then(() => {
        this.scene.start('LobbyScene');
      }).catch((error) => {
        console.error('Failed to connect:', error);
        alert('Failed to connect to server. Please check your connection.');
      });
    });

    // Add floating animation to title
    this.tweens.add({
      targets: title,
      y: 140,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
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

  createButton(x: number, y: number, text: string, onClick: () => void) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 50, COLORS.cream);
    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#2D3E50',
      fontStyle: 'bold'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(200, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(COLORS.coral);
      label.setColor('#FFF4E6');
    });

    button.on('pointerout', () => {
      bg.setFillStyle(COLORS.cream);
      label.setColor('#2D3E50');
    });

    button.on('pointerdown', onClick);

    return button;
  }

  showLevelSelect() {
    // Clear current scene
    this.children.removeAll();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.createGradientBackground();

    // Title
    const title = this.add.text(width / 2, 50, 'Select Level', {
      fontSize: '36px',
      color: '#FFF4E6',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Back button
    const backButton = this.createButton(width / 2, height - 60, 'BACK', () => {
      this.scene.restart();
    });

    // Level grid
    const progress = getProgress();
    const totalLevels = getTotalLevels();
    const columns = 5;
    const rows = Math.ceil(totalLevels / columns);
    const startX = 100;
    const startY = 120;
    const spacing = 120;

    for (let i = 1; i <= totalLevels; i++) {
      const row = Math.floor((i - 1) / columns);
      const col = (i - 1) % columns;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      const levelProgress = progress[i];
      const unlocked = i === 1 || (progress[i - 1]?.completed ?? false);

      this.createLevelButton(x, y, i, unlocked, levelProgress);
    }
  }

  createLevelButton(
    x: number,
    y: number,
    level: number,
    unlocked: boolean,
    progress?: { completed: boolean; stars: number; bestTime: number; deaths: number }
  ) {
    const button = this.add.container(x, y);

    const bg = this.add.circle(0, 0, 30, unlocked ? COLORS.cream : COLORS.navy);
    const label = this.add.text(0, 0, level.toString(), {
      fontSize: '24px',
      color: unlocked ? '#2D3E50' : '#666666',
      fontStyle: 'bold'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);

    if (progress?.completed) {
      // Show stars
      for (let i = 0; i < progress.stars; i++) {
        const star = this.add.text(-20 + i * 20, 40, '⭐', {
          fontSize: '16px'
        });
        star.setOrigin(0.5);
        button.add(star);
      }
    }

    if (unlocked) {
      button.setSize(60, 60);
      button.setInteractive(
        new Phaser.Geom.Circle(0, 0, 30),
        Phaser.Geom.Circle.Contains
      );

      button.on('pointerover', () => {
        bg.setFillStyle(COLORS.coral);
        label.setColor('#FFF4E6');
      });

      button.on('pointerout', () => {
        bg.setFillStyle(COLORS.cream);
        label.setColor('#2D3E50');
      });

      button.on('pointerdown', () => {
        this.scene.start('GameScene', { level });
      });
    }

    return button;
  }
}
