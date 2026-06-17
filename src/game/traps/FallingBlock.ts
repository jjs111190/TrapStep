import Phaser from 'phaser';

export class FallingBlock extends Phaser.Physics.Arcade.Sprite {
  private triggered: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'platform');

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static initially

    this.setTint(0xFFDDDD); // Slightly different color hint
  }

  trigger() {
    if (this.triggered) return;
    this.triggered = true;

    const scene = this.scene;

    // Shake warning
    scene.tweens.add({
      targets: this,
      x: this.x + 2,
      duration: 50,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        // Convert to dynamic body and fall
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        if (body) {
          // Remove static body and add dynamic
          this.scene.physics.world.remove(body);
          this.scene.physics.add.existing(this, false);

          const dynamicBody = this.body as Phaser.Physics.Arcade.Body;
          dynamicBody.setAllowGravity(true);
          dynamicBody.setVelocityY(100);

          // Destroy after falling off screen
          scene.time.delayedCall(3000, () => {
            this.destroy();
          });
        }
      }
    });
  }
}
