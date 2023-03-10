class EnemyState {
	constructor(name, enemy, animation) {
		this.name = name;
		this.enemy = enemy;
		this.animation = animation;
	}
}

class EnemyIdle extends EnemyState {
	constructor(enemy) {
		super('IDLE', enemy, 'idle');
	}
	enter() {
		this.enemy.setVelocityX(0);
	}
	handleState() {
		if (this.enemy.canRun) return this.enemy.setState('RUN');
		if (this.enemy.canDash && this.enemy.checkDashRange()) return this.enemy.setState('DASH');
	}
}

class EnemyRun extends EnemyState {
	constructor(enemy) {
		super('RUN', enemy, 'run');
	}
	enter() {
		this.enemy.setVelocityXByDirection();
	}
	handleState() {
		//if (this.enemy.canScaryRun() && this.enemy.checkScaryRun()) return this.enemy.setState('SCARY_RUN');
		if (this.enemy.checkAtackRange()) return this.enemy.setState('ATACK');
		if (this.enemy.canDash && this.enemy.checkDashRange()) return this.enemy.setState('DASH');
		if (this.enemy.canHitBomb && this.enemy.checkBombRange()) return this.enemy.setState('MOVE_TO_BOMB');
		if (this.enemy.canDash && this.enemy.checkDashRange() && !this.enemy.canMoveForward()) return this.enemy.setState('ATACK');
		if (!this.enemy.canMoveForward()) this.enemy.toogleDirection();
		if (this.enemy.body.velocity.x === 0) this.enemy.setVelocityXByDirection();
	}
}

class EnemyDash extends EnemyState {
	constructor(enemy) {
		super('DASH', enemy, 'dash');
	}
	enter() {
		this.enemy.makeDash();
	}
	handleState() {
		if (Phaser.Math.Distance.BetweenPoints(player, this.enemy) < 10) return this.enemy.setState('ATACK');
		if (this.enemy.canJump && player.y < this.enemy.y && Phaser.Math.Distance.BetweenPoints(player, this.enemy) < 100) return this.enemy.setState('JUMP');
		if (!this.enemy.checkDashRange()) return this.enemy.setState('RUN');
		if (!this.enemy.canMoveForward()) this.enemy.toogleDirection();
	}
}

class EnemyJump extends EnemyState {
	constructor(enemy) {
		super('JUMP', enemy, 'jump');
	}
	enter() {
		this.enemy.setVelocityY(-200)
	}
	handleState() {
		if (this.enemy.checkAtackRange()) return this.enemy.setState('AIR_ATACK');
		if (this.enemy.body.velocity.y > 0) return this.enemy.setState('FALL');
		if (this.enemy.body.blocked.down) this.enemy.setState('RUN');
	}
}

class EnemyFall extends EnemyState {
	constructor(enemy) {
		super('FALL', enemy, 'fall');
	}
	enter() {
	}
	handleState() {
		if (this.enemy.body.blocked.down) this.enemy.setState('RUN');
	}
}

class EnemyAtack extends EnemyState {
	constructor(enemy) {
		super('ATACK', enemy, 'atack');
	}
	enter() {
		this.enemy.setVelocityX(0);
	}
	handleState() {
		if (!this.enemy.checkAtackRange() && !this.enemy.canDash ||
			!this.enemy.checkAtackRange() && this.enemy.canDash && this.enemy.canMoveForward()) return this.enemy.setState('RUN');
		if (!this.enemy.checkDashRange() && this.enemy.canDash) return this.enemy.setState('RUN');
		//if (!this.enemy.checkAtackRange() && this.enemy.properties.canDash && this.enemy.canMoveForward()) this.enemy.setState('RUNNING');
		//if (this.enemy.properties.canDash && !this.enemy.canMoveForward() && !this.enemy.checkDashRange()) this.enemy.setState('RUNNING');
	}
}

class EnemyAirAtack extends EnemyState {
	constructor(enemy) {
		super('AIR_ATACK', enemy, 'air_atack');
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

class EnemyHit extends EnemyState {
	constructor(enemy) {
		super('HIT', enemy, 'hit');
	}
	enter() {
		setTimeout(() => this.enemy.setState('FALL'), 300);
		setTimeout(() => this.enemy.isInvulnerable = false, 1000);
	}
	handleState() {
	}
}

class EnemyDeadHit extends EnemyState {
	constructor(enemy) {
		super('DEAD_HIT', enemy, 'dead_hit');
	}
	enter() {
		this.enemy.setSize(30, 45);
		this.enemy.setDrag(100, 0);
		this.enemy.atackHitbox.destroy();
		setTimeout(() => this.enemy.destroy(), 2000);
	}
	handleState() {
	}
}

class EnemyMoveToBomb extends EnemyState {
	constructor(enemy) {
		super('MOVE_TO_BOMB', enemy, 'run');
	}
	enter() {
		this.enemy.moveToBomb();
	}
	handleState() {
		if (!this.enemy.checkBombRange()) this.enemy.setState('RUN')
	}
}

class EnemyHitBomb extends EnemyState {
	constructor(enemy) {
		super('HIT_BOMB', enemy, 'hit_bomb');
	}
	enter() {
		this.enemy.setVelocity(0);
		this.enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit_bomb', function (anims) {
			this.setState('RUN')
		}, this.enemy);
	}
	handleState() {

	}
}

class EnemyScaryRun extends EnemyState {
	constructor(enemy) {
		super('SCARY_RUN', enemy, 'scary_run');
	}
	enter() {
		this.enemy.makeScaryRun();
	}
	handleState() {
		if (!this.enemy.canMoveForward()) this.enemy.toogleDirection();
		this.enemy.setVelocityXByDirection(this.enemy.scaryRunSpeed);
		if (this.enemy.body.velocity.y > 0) this.enemy.setState('FALL');
		setTimeout(() => this.enemy.setState('RUN'), 500);
	}
}