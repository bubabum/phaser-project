class CapitanIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		this.enemy.setVelocityX(0);
	}
	handleState() {
		this.enemy.turnToPlayer();
		if (this.enemy.canRun()) return this.enemy.setState('RUN');
		if (this.enemy.checkAtackRange()) return this.enemy.setState('ATACK');
		if (this.enemy.checkThrowRange() && this.enemy.canThrow) return this.enemy.setState('THROW_BOTTLE');
	}
}

class CapitanRun extends State {
	constructor(enemy) {
		super({ name: 'RUN', enemy, animation: 'run' });
	}
	enter() {
		this.enemy.setVelocityXByDirection();
	}
	handleState() {
		if (this.enemy.checkAtackRange()) return this.enemy.setState('ATACK');
		if (this.enemy.checkThrow() && this.enemy.canThrow) return this.enemy.setState('THROW_BOTTLE');
		if (!this.enemy.canMoveForward()) this.enemy.toogleDirection();
		if (this.enemy.body.velocity.x === 0) this.enemy.setVelocityXByDirection();
	}
}

class CapitanThrowBottle extends State {
	constructor(enemy) {
		super({ name: 'THROW_BOTTLE', enemy, animation: 'air_atack' });
	}
	enter() {
		this.enemy.turnToPlayer();
		this.enemy.setVelocityX(0);
	}
	handleState() {
		this.enemy.throwBottle();
	}
}

class CapitanAtack extends State {
	constructor(enemy) {
		super({ name: 'ATACK', enemy, animation: 'atack' });
	}
	enter() {
		this.enemy.setVelocityX(0);
	}
	handleState() {
		this.enemy.turnToPlayer();
		if (!this.enemy.checkAtackRange()) return this.enemy.setState('IDLE');
	}
}