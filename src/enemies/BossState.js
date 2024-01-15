import { State } from '../utility/State';

export class BossWaiting extends State {
	constructor(enemy) {
		super({ name: 'WAITING', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
	}
	handleState() {
		const { enemy } = this;
	}
}

export class BossIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
		enemy.canThrow = true;
		enemy.bubbleTimer = enemy.scene.time.delayedCall(3500, () => enemy.setState('DISAPPEAR'));
	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		if (enemy.checkAtackRange()) return enemy.setState('ATACK');
	}
}

export class BossDisappear extends State {
	constructor(enemy) {
		super({ name: 'DISAPPEAR', enemy, animation: 'disappear' });
	}
	enter() {
		const { enemy } = this;
		enemy.hit = false;
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

export class BossAtack extends State {
	constructor(enemy) {
		super({ name: 'ATACK', enemy, animation: 'atack' });
	}
	enter() {
		const { enemy } = this;
		if (enemy.bubbleTimer) enemy.bubbleTimer.remove();
	}
	handleState() {
		const { enemy } = this;
		enemy.checkAtackFrame();
		if (enemy.anims.getProgress() === 1) enemy.setState('DISAPPEAR');
	}
}

export class BossHit extends State {
	constructor(enemy) {
		super({ name: 'HIT', enemy, animation: 'hit' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.time.delayedCall(1000, () => enemy.setInvulnerability(false));
		if (enemy.bubbleTimer) enemy.bubbleTimer.remove();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.getProgress() === 1) enemy.setState('DISAPPEAR');
	}
}

export class BossDeadHit extends State {
	constructor(enemy) {
		super({ name: 'DEAD_HIT', enemy, animation: 'dead_hit' });
	}
	enter() {
		const { enemy } = this;
		enemy.hurtbox.destroy();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.getProgress() === 1) enemy.setState('DEAD_GROUND');
	}
}

export class BossDeadGround extends State {
	constructor(enemy) {
		super({ name: 'DEAD_GROUND', enemy, animation: 'dead_ground' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.time.delayedCall(3000, () => {
			enemy.scene.exitGate.open();
			enemy.scene.cameras.main.pan(enemy.scene.player.x, enemy.scene.player.y, 500);
			enemy.scene.cameras.main.startFollow(enemy.scene.player, true, 0.1, 0.1);
			enemy.destroy();
		});
	}
	handleState() {
	}
}