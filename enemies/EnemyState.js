class EnemyJump extends State {
	constructor(enemy) {
		super({ name: 'JUMP', enemy, animation: 'jump' });
	}
	enter() {
		this.enemy.setVelocityY(-250)
	}
	handleState() {
		if (this.enemy.checkAtackRange()) return this.enemy.setState('AIR_ATACK');
		if (this.enemy.body.velocity.y > 0) return this.enemy.setState('FALL');
		if (this.enemy.body.blocked.down) this.enemy.setState('IDLE');
	}
}

class EnemyFall extends State {
	constructor(enemy) {
		super({ name: 'FALL', enemy, animation: 'fall' });
	}
	enter() {
	}
	handleState() {
		if (this.enemy.body.blocked.down) return this.enemy.setState('IDLE');
	}
}

class EnemyAtack extends State {
	constructor(enemy) {
		super({ name: 'ATACK', enemy, animation: 'atack' });
	}
	enter() {
		this.enemy.setVelocityX(0);
		this.enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atack', function (anims) {
			this.enemy.setState('IDLE');
		}, this);
	}
	handleState() {
	}
}

class EnemyAirAtack extends State {
	constructor(enemy) {
		super({ name: 'AIR_ATACK', enemy, animation: 'air_atack' });
	}
	enter() {
		this.enemy.setVelocityX(0);
		this.enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'air_atack', function (anims) {
			this.enemy.setState('FALL');
		}, this);
	}
	handleState() {
	}
}

class EnemyHit extends State {
	constructor(enemy) {
		super({ name: 'HIT', enemy, animation: 'hit' });
	}
	enter() {
		this.enemy.isInvulnerable = true;
		this.enemy.health--;
		this.enemy.scene.time.delayedCall(1000, () => this.enemy.isInvulnerable = false);
	}
	handleState() {
		if (this.enemy.body.velocity.y > 0) this.enemy.setState('FALL');
	}
}

class EnemyDeadHit extends State {
	constructor(enemy) {
		super({ name: 'DEAD_HIT', enemy, animation: 'dead_hit' });
	}
	enter() {
		this.enemy.health--;
		this.enemy.setSize(30, 45);
		this.enemy.setDrag(100, 0);
		this.enemy.hurtbox.destroy();
		this.enemy.scene.time.delayedCall(2000, () => this.enemy.destroy());
	}
	handleState() {
	}
}

class EnemyMoveToBomb extends State {
	constructor(enemy) {
		super({ name: 'MOVE_TO_BOMB', enemy, animation: 'run' });
	}
	enter() {
		this.enemy.moveToBomb();
	}
	handleState() {
		if (!this.enemy.checkBombRange()) this.enemy.setState('IDLE')
	}
}