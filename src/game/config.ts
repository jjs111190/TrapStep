import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import LobbyScene from './scenes/LobbyScene';
import NetworkGameScene from './scenes/NetworkGameScene';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const TILE_SIZE = 32;

// Color palette (Level Devil inspired - Black/Green/Yellow)
export const COLORS = {
  black: 0x0A0A0A,      // Deep black background
  green: 0x00FF41,      // Bright neon green
  yellow: 0xFFFF00,     // Bright yellow
  white: 0xFFFFFF,      // Pure white
  red: 0xFF0000         // Bright red for danger
};

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0A0A0A',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene, LobbyScene, NetworkGameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: true,
    antialias: false
  }
};
