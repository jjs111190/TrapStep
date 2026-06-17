import Phaser from 'phaser';

export class FakePlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'platform');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Looks like a platform but doesn't provide collision
    // Instead, it kills the player on overlap
    this.setTint(0xFFEEEE); // Slightly different color
    this.body!.setAllowGravity(false);
    this.setImmovable(true);

    // Subtle pulsing to hint something is off
    scene.tweens.add({
      targets: this,
      alpha: 0.9,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
