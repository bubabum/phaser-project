class Capitan extends Enemy {

   constructor(scene, x, y, textureKey) {
      super(scene, x, y, textureKey);
      this.setSize(30, 67);
      this.setOffset(20, 5);
      this.createAnimations(textureKey);
      this.states = [
         new EnemyIdle(this),
         new EnemyRunning(this),
         new EnemyAtack(this),
         new EnemyHit(this),
      ];
      this.setState('IDLE');
      this.velocityX = 120;
   }

   createAnimations(textureKey) {
      this.anims.create({
         key: 'IDLE',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 31 }),
         frameRate: 20,
         repeat: -1,
      });
      this.anims.create({
         key: 'RUNNING',
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
      this.anims.create({
         key: 'HIT',
         frames: this.anims.generateFrameNumbers(textureKey, { start: 75, end: 82 }),
         frameRate: 20,
         repeat: -1,
      });
   }

}