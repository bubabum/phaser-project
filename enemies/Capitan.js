class Capitan extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, textureKey) {
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setSize(30, 67);
      this.setOffset(20, 5);
      this.createAnimations(textureKey);
      this.anims.play('RUN')
   }

   preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if (this?.body?.velocity?.x < 0) {
         this.flipX = true;
         this.setOffset(30, 5);
      }
      if (this?.body?.velocity?.x > 0) {
         this.flipX = false;
         this.setOffset(20, 5);
      }
   }

   createAnimations(textureKey) {
      this.anims.create({
         key: 'RUN',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 32, end: 45 }),
         frameRate: 20,
         repeat: -1,
      });
      this.anims.create({
         key: 'ATACK',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
         frameRate: 20,
         repeat: -1,
      });
   }

}