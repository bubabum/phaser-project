import { State } from '../utility/State';

export class EnemyJump extends State {
	constructor(enemy) {
		super({ name: 'JUMP', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity);
		enemy.removeTouchingPlatform();
	}
	handleState() {
		if (this.enemy.checkAtackRange()) return this.enemy.setState('AIR_ATACK');
		if (this.enemy.body.velocity.y > 0) return this.enemy.setState('FALL');
		if (this.enemy.body.onFloor()) this.enemy.setState('IDLE');
	}
}

export class EnemyFall extends State {
	constructor(enemy) {
		super({ name: 'FALL', enemy, animation: 'fall' });
	}
	enter() {
		const { enemy } = this;
		enemy.removeTouchingPlatform();
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
		const { enemy } = this;
		enemy.scene.enemySounds.play('enemy_atack');
		enemy.setVelocityX(0);
	}
	handleState() {
		const { enemy } = this;
		enemy.checkAtackFrame();
		if (enemy.anims.getProgress() === 1) enemy.setState('IDLE');
	}
}

export class EnemyAirAtack extends State {
	constructor(enemy) {
		super({ name: 'AIR_ATACK', enemy, animation: 'air_atack' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.enemySounds.play('enemy_atack');
		enemy.setVelocityX(0);
	}
	handleState() {
		const { enemy } = this;
		enemy.checkAtackFrame();
		if (enemy.anims.getProgress() === 1) enemy.setState('FALL');
	}
}

export class EnemyHit extends State {
	constructor(enemy) {
		super({ name: 'HIT', enemy, animation: 'hit' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.enemySounds.play('enemy_get_hit');
		enemy.removeTouchingPlatform();
		enemy.scene.time.delayedCall(1000, () => enemy.setInvulnerability(false));
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) enemy.setState('FALL');
	}
}

export class EnemyDeadHit extends State {
	constructor(enemy) {
		super({ name: 'DEAD_HIT', enemy, animation: 'dead_hit' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.enemySounds.play('enemy_death');
		enemy.setDrag(100, 0);
		enemy.hurtbox.destroy();
		if (enemy.bombToInteract) enemy.bombToInteract = null;
		enemy.removeTouchingPlatform();
		this.gap = false;
		enemy.scene.time.delayedCall(50, () => this.gap = true);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.onFloor() && this.gap) enemy.setState('DEAD_GROUND');
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