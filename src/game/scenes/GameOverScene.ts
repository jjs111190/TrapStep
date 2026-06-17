import Phaser from 'phaser';
import { COLORS } from '../config';
import { saveProgress, getProgress, getTotalLevels } from '../../utils/storage';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: {
    level: number;
    time: number;
    deaths: number;
    stars: number;
    completed: boolean;
  }) {
    const width = this.cameras.main.width;

    // Background
    this.createGradientBackground();

    // Save progress
    if (data.completed) {
      const progress = getProgress();
      const existing = progress[data.level];

      const isNewBest = !existing ||
        data.time < existing.bestTime ||
        data.stars > existing.stars;

      saveProgress(data.level, {
        completed: true,
        bestTime: existing ? Math.min(data.time, existing.bestTime) : data.time,
        stars: existing ? Math.max(data.stars, existing.stars) : data.stars,
        deaths: existing ? Math.min(data.deaths, existing.deaths) : data.deaths
      });

      // Title
      const title = this.add.text(width / 2, 100, 'Level Complete!', {
        fontSize: '48px',
        color: '#FFF4E6',
        fontStyle: 'bold'
      });
      title.setOrigin(0.5);

      // Stars
      const starsContainer = this.add.container(width / 2, 180);
      for (let i = 0; i < 3; i++) {
        const star = this.add.text(i * 60 - 60, 0, i < data.stars ? '⭐' : '☆', {
          fontSize: '48px'
        });
        star.setOrigin(0.5);
        starsContainer.add(star);

        if (i < data.stars) {
          this.tweens.add({
            targets: star,
            scale: 1.2,
            duration: 300,
            yoyo: true,
            delay: i * 200
          });
        }
      }

      // Stats
      const statsY = 280;
      this.add.text(width / 2, statsY, `Time: ${data.time}s`, {
        fontSize: '24px',
        color: '#FFF4E6'
      }).setOrigin(0.5);

      this.add.text(width / 2, statsY + 40, `Deaths: ${data.deaths}`, {
        fontSize: '24px',
        color: '#FF7F7F'
      }).setOrigin(0.5);

      if (isNewBest) {
        const newBestText = this.add.text(width / 2, statsY + 80, '🎉 New Best!', {
          fontSize: '20px',
          color: '#FFD700',
          fontStyle: 'bold'
        });
        newBestText.setOrigin(0.5);

        this.tweens.add({
          targets: newBestText,
          scale: 1.1,
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      }

      // Buttons
      const buttonY = 420;

      if (data.level < getTotalLevels()) {
        this.createButton(width / 2 - 120, buttonY, 'NEXT', () => {
          this.scene.start('GameScene', { level: data.level + 1 });
        });
      }

      this.createButton(width / 2 + 120, buttonY, 'RETRY', () => {
        this.scene.start('GameScene', { level: data.level });
      });

      this.createButton(width / 2, buttonY + 80, 'MENU', () => {
        this.scene.start('MenuScene');
      });
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

  createButton(x: number, y: number, text: string, onClick: () => void) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 150, 50, COLORS.cream);
    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#2D3E50',
      fontStyle: 'bold'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(150, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-75, -25, 150, 50),
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
}
