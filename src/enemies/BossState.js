import { State } from '../utility/State';

export class BossIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
		//enemy.setVelocityX(0);
		enemy.canThrow = true;
		enemy.bubbleTimer = enemy.scene.time.delayedCall(3500, () => enemy.setState('DISAPPEAR'));
	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		// if (enemy.canRun()) return enemy.setState('RUN');
		// if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		// if (enemy.checkThrowRange() && enemy.canThrow) return enemy.setState('THROW_BOTTLE');
	}
}

export class BossDisappear extends State {
	constructor(enemy) {
		super({ name: 'DISAPPEAR', enemy, animation: 'disappear' });
	}
	enter() {
		const { enemy } = this;
		enemy.turnToPlayer();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.getProgress() === 1) enemy.setState('APPEAR');
	}
}
export class BossAppear extends State {
	constructor(enemy) {
		super({ name: 'APPEAR', enemy, animation: 'appear' });
	}
	enter() {
		const { enemy } = this;
		enemy.changePosition();
		enemy.turnToPlayer();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.getProgress() === 1) enemy.setState('THROW_BUBBLE');
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
		if (enemy.anims.currentFrame.index > 4) enemy.throwBubble();
		if (enemy.anims.getProgress() === 1) enemy.setState('IDLE');
	}
}