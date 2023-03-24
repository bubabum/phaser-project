class CapitanIdle extends State {
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
		if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		if (enemy.checkThrowRange() && enemy.canThrow) return enemy.setState('THROW_BOTTLE');
	}
}

class CapitanRun extends State {
	constructor(enemy) {
		super({ name: 'RUN', enemy, animation: 'run' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityXByDirection();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		if (enemy.checkThrowRange() && enemy.canThrow) return enemy.setState('THROW_BOTTLE');
		if (!enemy.canMoveForward()) enemy.toogleDirection();
		if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection();
	}
}

class CapitanThrowBottle extends State {
	constructor(enemy) {
		super({ name: 'THROW_BOTTLE', enemy, animation: 'air_atack' });
	}
	enter() {
		const { enemy } = this;
		enemy.turnToPlayer();
		enemy.setVelocityX(0);
	}
	handleState() {
		const { enemy } = this;
		enemy.throwBottle();
	}
}

class CapitanAtack extends State {
	constructor(enemy) {
		super({ name: 'ATACK', enemy, animation: 'atack' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityX(0);
	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		if (!enemy.checkAtackRange()) return enemy.setState('IDLE');
	}
}