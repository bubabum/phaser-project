class Spike extends Phaser.Physics.Arcade.Sprite {

   constructor({ scene, x, y, textureKey }) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setDepth(25);
      this.setSize(64, 13);
      this.setOffset(0, 51);
      this.setOrigin(0, 0);
      if (scene.hasLight) this.setPipeline('Light2D');
   }

}