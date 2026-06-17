import Phaser from 'phaser';
import { TILE_SIZE } from '../config';

export class MovingWall extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private startY: number;
  private moveDistanceX: number;
  private moveDistanceY: number;
  private speed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    moveX: number = 0,
    moveY: number = 0,
    speed: number = 2000
  ) {
    super(scene, x, y, 'wall');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.startX = x;
    this.startY = y;
    this.moveDistanceX = moveX * TILE_SIZE;
    this.moveDistanceY = moveY * TILE_SIZE;
    this.speed = speed;

    this.setImmovable(true);
    this.body!.setAllowGravity(false);

    // Start moving
    this.startMoving(scene);
  }

  private startMoving(scene: Phaser.Scene) {
    const targetX = this.startX + this.moveDistanceX;
    const targetY = this.startY + this.moveDistanceY;

    scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: this.speed,
      yoyo: true,
      repeat: -1,
      ease: 'Linear'
    });
  }
}
