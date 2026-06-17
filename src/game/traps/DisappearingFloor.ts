import Phaser from 'phaser';

export class DisappearingFloor extends Phaser.Physics.Arcade.Sprite {
  private triggered: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'platform');

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    // Listen for player collision
    scene.physics.world.on('worldstep', () => {
      this.checkPlayerContact(scene);
    });
  }

  private checkPlayerContact(scene: Phaser.Scene) {
    if (this.triggered) return;

    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    if (!body) return;

    // Check if player is touching this platform
    const touching = body.touching;
    if (touching.up || touching.down || touching.left || touching.right) {
      this.trigger(scene);
    }
  }

  private trigger(scene: Phaser.Scene) {
    if (this.triggered) return;
    this.triggered = true;

    // Flash warning
    scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        // Disappear
        scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.disableBody(true, false);
          }
        });
      }
    });
  }
}
