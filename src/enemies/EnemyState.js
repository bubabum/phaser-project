import { State } from '../utility/State';

export class EnemyJump extends State {
	constructor(enemy) {
		super({ name: 'JUMP', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity)
	}
	handleState() {
		if (this.enemy.checkAtackRange()) return this.enemy.setState('AIR_ATACK');
		if (this.enemy.body.velocity.y > 0) return this.enemy.setState('FALL');
		if (this.enemy.body.blocked.down) this.enemy.setState('IDLE');
	}
}

export class EnemyFall extends State {
	constructor(enemy) {
		super({ name: 'FALL', enemy, animation: 'fall' });
	}
	enter() {
	}
	handleState() {
		if (this.enemy.body.blocked.down) return this.enemy.setState('IDLE');
	}
}

export class EnemyAtack extends State {
	constructor(enemy) {
		super({ name: 'ATACK', enemy, animation: 'atack' });
	}
	enter() {
		this.enemy.setVelocityX(0);
		this.enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'atack', function (anims) {
			this.enemy.hit = false;
			this.enemy.setState('IDLE');
		}, this);
	}
	handleState() {
		if (this.enemy.checkAtackFrame()) this.enemy.atack();
	}
}

export class EnemyAirAtack extends State {
	constructor(enemy) {
		super({ name: 'AIR_ATACK', enemy, animation: 'air_atack' });
	}
	enter() {
		this.enemy.setVelocityX(0);
		this.enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'air_atack', function (anims) {
			this.enemy.hit = false;
			this.enemy.setState('FALL');
		}, this);
	}
	handleState() {
		if (this.enemy.checkAtackFrame()) this.enemy.atack();
	}
}

export class EnemyHit extends State {
	constructor(enemy) {
		super({ name: 'HIT', enemy, animation: 'hit' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.time.delayedCall(1000, () => enemy.setInvulnerability(false));
		if (enemy.isBoss() && enemy.bubbleTimer) enemy.bubbleTimer.remove();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) enemy.setState('FALL');
		if (enemy.isBoss() && enemy.anims.getProgress() === 1) enemy.setState('DISAPPEAR');
	}
}

export class EnemyDeadHit extends State {
	constructor(enemy) {
		super({ name: 'DEAD_HIT', enemy, animation: 'dead_hit' });
	}
	enter() {
		this.enemy.setDrag(100, 0);
		this.enemy.hurtbox.destroy();
		if (this.bombToInteract) this.bombToInteract = null;
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y === 0) enemy.setState('DEAD_GROUND');
	}
}

export class EnemyDeadGround extends State {
	constructor(enemy) {
		super({ name: 'DEAD_GROUND', enemy, animation: 'dead_ground' });
	}
	enter() {
		this.enemy.scene.time.delayedCall(5000, () => this.enemy.destroy());
	}
	handleState() {
	}
}

export class EnemyMoveToBomb extends State {
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