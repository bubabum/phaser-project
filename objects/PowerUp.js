class PowerUp extends Phaser.Physics.Arcade.Sprite {

   constructor({ scene, x, y, textureKey }) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setPosition(x, y);
      this.setDepth(25);
      this.isActive = false;
      this.createAnimations(textureKey);
      this.anims.play('idle');
   }

   disappear() {
      this.isActive = true;
      this.anims.play('effect');
      this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'effect', function (anims) {
         this.destroy();
      }, this);
   }

}