class CucumberIdle extends State {
   constructor(enemy) {
      super({ name: 'IDLE', enemy, animation: 'idle' });
   }
   enter() {
      const { enemy } = this;
      enemy.setVelocityX(0);
   }
   handleState() {
      const { enemy } = this;
      enemy.turnToPlayer();
      if (enemy.canRun()) return enemy.setState('RUN');
      // if (enemy.checkMoveToPlayer()) return enemy.setState('MOVE_TO_PLAYER');
      // if (enemy.checkBombRange()) return enemy.setState('MOVE_TO_BOMB');
   }
}

class CucumberRun extends State {
   constructor(enemy) {
      super({ name: 'RUN', enemy, animation: 'run' });
   }
   enter() {
      const { enemy } = this;
      enemy.setVelocityXByDirection();
   }
   handleState() {
      const { enemy } = this;
      if (!enemy.canRun()) return enemy.setState('IDLE');
      if (enemy.checkDashRange()) return this.enemy.setState('DASH');
      // if (enemy.checkMoveToPlayer()) return enemy.setState('MOVE_TO_PLAYER');
      // if (enemy.checkAtackRange()) return enemy.setState('ATACK');
      if (enemy.checkBombRange()) return enemy.setState('MOVE_TO_BOMB');
      if (!enemy.canMoveForward()) enemy.toogleDirection();
      if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection();
   }
}

class CucumberDash extends State {
   constructor(enemy) {
      super({ name: 'DASH', enemy, animation: 'dash' });
   }
   enter() {
      this.enemy.makeDash();
   }
   handleState() {
      if (Phaser.Math.Distance.BetweenPoints(this.enemy.player, this.enemy) < 10) return this.enemy.setState('ATACK');
      if (this.enemy.player.y < this.enemy.y && Phaser.Math.Distance.BetweenPoints(this.enemy.player, this.enemy) < 100) return this.enemy.setState('JUMP');
      if (!this.enemy.checkDashRange()) return this.enemy.setState('RUN');
      //if (this.enemy.direction === 'right' && player.x < this.enemy.x || this.enemy.direction === 'left' && player.x > this.enemy.x) this.enemy.toogleDirection();
      if (!this.enemy.canMoveForward()) this.enemy.toogleDirection();
      if (this.enemy.body.velocity.x === 0) this.enemy.setVelocityXByDirection(this.enemy.dashSpeedX);
   }
}