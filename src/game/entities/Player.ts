import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed: number = 200;
  private jumpPower: number = 350;
  private isJumping: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setBounce(0);
    this.setScale(1);
  }

  update(left: boolean, right: boolean, jump: boolean) {
    if (!this.active) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Horizontal movement
    if (left) {
      this.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (right) {
      this.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jump
    const onGround = body.blocked.down || body.touching.down;

    if (onGround) {
      this.isJumping = false;
    }

    if (jump && onGround && !this.isJumping) {
      this.setVelocityY(-this.jumpPower);
      this.isJumping = true;
    }

    // Squash and stretch animation based on velocity
    const normalScale = 1;
    if (Math.abs(body.velocity.y) > 100) {
      const stretch = 1 + Math.abs(body.velocity.y) / 2000;
      if (body.velocity.y < 0) {
        // Jumping - stretch vertically
        this.setScale(normalScale / stretch, normalScale * stretch);
      } else {
        // Falling - stretch vertically
        this.setScale(normalScale / stretch, normalScale * stretch);
      }
    } else {
      this.setScale(normalScale, normalScale);
    }
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
  }
}
