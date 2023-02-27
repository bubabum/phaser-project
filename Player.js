class Player extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, textureKey) {
      super(scene, x, y, textureKey);
      //scene.physics.add.sprite(this);
      //this.setPosition(x, y);
   }

   preUpdate(time, delta) {
      super.preUpdate(time, delta);
      //this.rotation += 0.01;
   }

}