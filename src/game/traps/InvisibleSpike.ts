import Phaser from 'phaser';

export class InvisibleSpike extends Phaser.Physics.Arcade.Sprite {
  private player: Phaser.Physics.Arcade.Sprite;
  private revealDistance: number = 100;
  private revealed: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    player: Phaser.Physics.Arcade.Sprite
  ) {
    super(scene, x, y, 'spike');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.player = player;
    this.setAlpha(0); // Start invisible
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    this.setImmovable(true);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    // Check distance to player
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    if (distance < this.revealDistance && !this.revealed) {
      this.reveal();
    }
  }

  private reveal() {
    this.revealed = true;

    // Fade in quickly
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });

    // Add pulsing effect
    this.scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // Public reveal method for manual triggering (used in NetworkGameScene)
  public revealManually() {
    if (!this.revealed) {
      this.reveal();
    }
  }

  isRevealed(): boolean {
    return this.revealed;
  }

  isVisible(): boolean {
    return this.revealed;
  }
}
