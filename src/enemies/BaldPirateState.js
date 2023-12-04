import { State } from '../utility/State';

export class BaldPirateIdle extends State {
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
		if (enemy.checkMoveToPlayer()) return enemy.setState('MOVE_TO_PLAYER');
		if (enemy.checkBombRange()) return enemy.setState('MOVE_TO_BOMB');
	}
}

export class BaldPirateRun extends State {
	constructor(enemy) {
		super({ name: 'RUN', enemy, animation: 'run' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityXByDirection();
	}
	handleState() {
		const { enemy } = this;
		if (!enemy.canRun()) return enemy.setState('IDLE');
		if (enemy.checkMoveToPlayer()) return enemy.setState('MOVE_TO_PLAYER');
		if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		if (enemy.checkBombRange()) return enemy.setState('MOVE_TO_BOMB');
		if (!enemy.canMoveForward()) enemy.toogleDirection();
		if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection();
	}
}

export class BaldPirateMoveToPlayer extends State {
	constructor(enemy) {
		super({ name: 'MOVE_TO_PLAYER', enemy, animation: 'run' });
	}
	enter() {

	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		enemy.setVelocityXByDirection();
		if (!enemy.checkMoveToPlayer()) return enemy.setState('IDLE');
		if (enemy.checkAtackRange()) return enemy.setState('ATACK');
		if (enemy.checkPlayerOnTile(0, 1) || enemy.checkPlayerOnTile(0, -1)) enemy.setState('JUMP');
		if (enemy.canMoveForward()) return
		if (enemy.checkClimbUp()) return enemy.setState('CLIMB_UP');
		if (enemy.checkPlayerOnTile(2, 1)) return enemy.setState('LONG_JUMP_DOWN');
		if (enemy.checkPlayerOnTile(2, -1)) return enemy.setState('LONG_JUMP_UP');
		if (enemy.checkPlayerOnTile(1, 1)) return enemy.setState('JUMP_DOWN');
		if (enemy.checkPlayerOnTile(1, -1) || enemy.checkPlayerOnTile(2, 0)) return enemy.setState('JUMP_UP');
	}
}

export class BaldPirateClimbUp extends State {
	constructor(enemy) {
		super({ name: 'CLIMB_UP', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity)
	}
	handleState() {
		const { enemy } = this;
		if (enemy.canMoveForward()) enemy.setVelocityXByDirection(50);
		if (enemy.body.velocity.y > 0) return enemy.setState('FALL');
	}
}

export class BaldPirateJumpUp extends State {
	constructor(enemy) {
		super({ name: 'JUMP_UP', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity * 0.9)
		enemy.setVelocityXByDirection(90);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) return enemy.setState('FALL');
	}
}

export class BaldPirateLongJumpUp extends State {
	constructor(enemy) {
		super({ name: 'LONG_JUMP_UP', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity)
		enemy.setVelocityXByDirection(120);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) return enemy.setState('FALL');
	}
}

export class BaldPirateJumpDown extends State {
	constructor(enemy) {
		super({ name: 'JUMP_DOWN', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity * 0.4)
		enemy.setVelocityXByDirection(70);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) return enemy.setState('FALL');
	}
}

export class BaldPirateLongJumpDown extends State {
	constructor(enemy) {
		super({ name: 'LONG_JUMP_DOWN', enemy, animation: 'jump' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityY(enemy.jumpVelocity * 0.4)
		enemy.setVelocityXByDirection(120);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.body.velocity.y > 0) return enemy.setState('FALL');
	}
}

export class BaldPirateHitBomb extends State {
	constructor(enemy) {
		super({ name: 'INTERACT_WITH_BOMB', enemy, animation: 'hit_bomb' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocity(0);
		enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit_bomb', function (anims) {
			enemy.setState('IDLE')
		}, enemy);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.currentFrame.index > 4 && enemy.bombToInteract) enemy.interactWithBomb();
	}
}
