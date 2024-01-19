import { State } from '../utility/State';

export class CapitanIdle extends State {
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

export class CapitanRun extends State {
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

export class CapitanThrowBottle extends State {
	constructor(enemy) {
		super({ name: 'THROW_BOTTLE', enemy, animation: 'air_atack' });
	}
	enter() {
		const { enemy } = this;
		enemy.turnToPlayer();
		enemy.setVelocityX(0);
		enemy.scene.enemySounds.play('enemy_atack');
	}
	handleState() {
		const { enemy } = this;
		enemy.throwBottle();
	}
}