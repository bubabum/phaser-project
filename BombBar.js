class BombBar extends Phaser.Physics.Arcade.Sprite {

   constructor({ scene, player, textureKey }) {
      super(scene, player.body.x, player.body.y - 15, textureKey);
      scene.add.existing(this);
      this.player = player;
      this.setVisible(false);
      this.createAnimations(textureKey);
   }

   update() {
      this.setPosition(this.player.body.center.x, this.player.body.y - 15);
      if (Phaser.Input.Keyboard.JustDown(keySpace)) this.chargeBomb();
      if (Phaser.Input.Keyboard.JustUp(keySpace)) this.setVisible(false);
   }

   chargeBomb() {
      if (bombs.getChildren().length === 3) return
      this.setVisible(true);
      this.anims.play('CHARGING');
   }

   createAnimations(textureKey) {
      this.anims.create({
         key: 'CHARGING',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 10 }),
         frameRate: 15,
         repeat: 0,
      });
   }

}