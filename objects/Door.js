class Door extends Phaser.Physics.Arcade.Sprite {

   constructor({ scene, x, y, textureKey }) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      this.createAnimations(textureKey);
   }

   openAndClose() {
      this.anims.play('OPENING');
      this.anims.chain('CLOSING');
      this.anims.chain('CLOSED');
   }

   createAnimations(textureKey) {
      this.anims.create({
         key: 'CLOSED',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 0 }),
         frameRate: 20,
         repeat: 0,
      });
      this.anims.create({
         key: 'OPENING',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 1, end: 5 }),
         frameRate: 20,
         repeat: 0,
      });
      this.anims.create({
         key: 'CLOSING',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 6, end: 10 }),
         frameRate: 20,
         repeat: 0,
      });
   }

}