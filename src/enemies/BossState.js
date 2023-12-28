import { State } from '../utility/State';

export class BossIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
		//enemy.setVelocityX(0);
		this.enemy.scene.time.delayedCall(4000, () => enemy.setState('MOVE'));
	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		// if (enemy.canRun()) return enemy.setState('RUN');
		// if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		// if (enemy.checkThrowRange() && enemy.canThrow) return enemy.setState('THROW_BOTTLE');
	}
}

export class BossMove extends State {
	constructor(enemy) {
		super({ name: 'MOVE', enemy, animation: 'run' });
	}
	enter() {
		const { enemy } = this;
		enemy.changePosition();
		enemy.setState('THROW_BUBBLE');
		// enemy.setVelocityXByDirection();
	}
	handleState() {
		const { enemy } = this;
		// if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		// if (enemy.checkThrowRange() && enemy.canThrow) return enemy.setState('THROW_BOTTLE');
		// if (!enemy.canMoveForward()) enemy.toogleDirection();
		// if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection();
	}
}

export class BossThrowBubble extends State {
	constructor(enemy) {
		super({ name: 'THROW_BUBBLE', enemy, animation: 'throw_bubble' });
	}
	enter() {
		const { enemy } = this;
		enemy.turnToPlayer();
	}
	handleState() {
		const { enemy } = this;
		enemy.throwBubble();
	}
}