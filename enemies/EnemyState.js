class EnemyIdle extends State {
   constructor(carrier) {
      super('IDLE', carrier);
   }
   enter() {
      this.carrier.setVelocityX(0);
   }
   handleState() {
      this.carrier.setState('RUNNING');
   }
}

class EnemyRunning extends State {
   constructor(carrier) {
      super('RUNNING', carrier);
   }
   enter() {
      this.carrier.setVelocityX(this.carrier.velocityX * (this.carrier.flipX ? -1 : 1));
   }
   handleState() {
      if (Phaser.Math.Distance.BetweenPoints(player, this.carrier) < 40) this.carrier.setState('ATACK');
      if (this.carrier.walkingBehavior()) {
         if (this.carrier.flipX) {
            this.carrier.setVelocityX(this.carrier.velocityX);
         } else {
            this.carrier.setVelocityX(-this.carrier.velocityX)
         }
      };
   }
}

class EnemyAtack extends State {
   constructor(carrier) {
      super('ATACK', carrier);
   }
   enter() {
      this.carrier.setVelocityX(0);
   }
   handleState() {
      if (Phaser.Math.Distance.BetweenPoints(player, this.carrier) > 40) this.carrier.setState('RUNNING');
   }
}

class EnemyHit extends State {
   constructor(carrier) {
      super('HIT', carrier);
   }
   enter() {
      setTimeout(() => this.carrier.setState('RUNNING'), 300);
   }
   handleState() {
   }
}