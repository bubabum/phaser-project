import { State } from '../utility/State';

export class Idle extends State {
	constructor(player) {
		super({ name: 'IDLE', player, animation: 'idle' });
	}
	enter() {
	}
	handleInput({ controller }) {
		const { player } = this;
		const { moveRight, moveLeft, jump } = controller.buttons
		if (moveRight.isPressed || moveLeft.isPressed) player.setState('RUN');
		if (jump.justDown) player.setState('JUMP');
	}
}

export class Run extends State {
	constructor(player) {
		super({ name: 'RUN', player, animation: 'run' });
	}
	enter() {
		const { player } = this;
	}
	handleInput({ controller }) {
		const { player } = this;
		const { moveRight, moveLeft, jump } = controller.buttons;
		if (!player.sounds.isPlaying('walk')) player.sounds.play('walk');
		let velocity = 0;
		if (player.touchingPlatform.x) velocity = player.touchingPlatform.x.body.velocity.x;
		if (moveRight.isPressed) {
			player.setVelocityX((velocity > 0 ? player.runVelocity : player.runVelocity - velocity));
		} else if (moveLeft.isPressed) {
			player.setVelocityX((velocity < 0 ? -player.runVelocity : -player.runVelocity - velocity));
		} else {
			player.setVelocityX(0);
			player.setState('IDLE');
		}
		if (jump.justDown) return player.setState('JUMP');
		if (player.body.velocity.y > 0 && !player.touchingPlatform.y || !player.body.onFloor()) {
			player.setState('FALL');
			player.jumpGap = true;
			player.scene.time.delayedCall(132, () => player.jumpGap = false);
		}
	}
}
// class Dash extends State {
// 	constructor(player) {
// 		super({ name: 'DASH', player, animation: 'run' });
// 	}
// 	enter() {
// 		const { player } = this;
// 		player.setVelocity(player.runVelocity * 2.5, 0);
// 		player.body.setAllowGravity(false);
// 		player.scene.time.delayedCall(200, () => {
// 			player.body.setAllowGravity(true);
// 			player.setVelocityX(0);
// 			player.setState('IDLE');
// 		});
// 	}
// 	handleInput({ cursors, keyM }) {

// 	}
// }

export class Jump extends State {
	constructor(player) {
		super({ name: 'JUMP', player, animation: 'jump' });
	}
	enter() {
		const { player } = this;
		player.sounds.play('jump');
		player.setVelocityY(player.jumpVelocity);
		player.removeTouchingPlatform();
	}
	handleInput({ controller }) {

		const { player } = this;
		const { moveRight, moveLeft } = controller.buttons
		if (moveRight.isPressed) {
			player.setVelocityX(player.runVelocity + 20);
		} else if (moveLeft.isPressed) {
			player.setVelocityX(-player.runVelocity - 20);
		} else {
			player.setVelocityX(0);
		}
		if (player.body.velocity.y > 0) return player.setState('FALL');
		if (player.body.velocity.y === 0 && player.body.onFloor() || player.touchingPlatform.y && player.body.onFloor()) player.setState('LAND');
	}
}

export class Fall extends State {
	constructor(player) {
		super({ name: 'FALL', player, animation: 'fall' });
	}
	enter() {
		const { player } = this;
		player.setVelocityY(0);
		player.removeTouchingPlatform();
		this.nextJumpReady = false;
		this.nextJumpBuffer = 0;
	}
	handleInput({ dt, controller }) {
		const { player } = this;
		const { moveRight, moveLeft, jump } = controller.buttons;
		if (player.body.velocity.y > 300) player.setVelocityY(300);
		if (moveRight.isPressed) {
			player.setVelocityX(player.runVelocity + 20);
		} else if (moveLeft.isPressed) {
			player.setVelocityX(-player.runVelocity - 20);
		} else {
			player.setVelocityX(0);
		}
		if (jump.justDown && !player.madeDoubleJump && player.hasActiveRum) {
			player.setState('JUMP');
			player.madeDoubleJump = true;
			return
		}
		if (jump.justDown && player.jumpGap) {
			player.setState('JUMP');
			player.jumpGap = false;
			return
		}
		if (this.nextJumpReady) this.nextJumpBuffer += dt;
		if (jump.justDown) this.nextJumpReady = true;
		if (this.nextJumpBuffer > 116) [this.nextJumpReady, this.nextJumpBuffer] = [false, 0];
		if (player.body.onFloor() && this.nextJumpReady) return player.setState('JUMP');
		if (player.body.velocity.y === 0 && player.body.onFloor() || player.touchingPlatform.y && player.body.onFloor()) player.setState('LAND');
	}
}

export class Land extends State {
	constructor(player) {
		super({ name: 'LAND', player, animation: 'land' });
	}
	enter() {
		const { player } = this;
		player.sounds.play('land');
		player.setVelocityX(0);
		player.madeDoubleJump = false;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
			player.setState('IDLE');
		}, this);
	}
	handleInput({ controller }) {
		const { player } = this;
		const { moveRight, moveLeft, jump } = controller.buttons
		if (jump.justDown) return player.setState('JUMP');
		if (moveRight.isPressed || moveLeft.isPressed) return player.setState('RUN');
	}
}

export class Hit extends State {
	constructor(player) {
		super({ name: 'HIT', player, animation: 'hit' });
	}
	enter() {
		const { player } = this;
		player.sounds.play('hit');
		player.removeTouchingPlatform();
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit', function (anims) {
			player.setState('FALL');
			player.scene.time.delayedCall(2000, () => player.setInvulnerability(false));
		}, this);
	}
	handleInput() {

	}
}

export class DeadHit extends State {
	constructor(player) {
		super({ name: 'DEAD_HIT', player, animation: 'dead_hit' });
	}
	enter() {
		const { player } = this;
		player.sounds.play('hit');
		player.removeTouchingPlatform();
		this.gap = false;
		player.scene.time.delayedCall(50, () => this.gap = true);
	}
	handleInput() {
		const { player } = this;
		if (player.body.onFloor() && this.gap) player.setState('DEAD_GROUND');
	}
}

export class DeadGround extends State {
	constructor(player) {
		super({ name: 'DEAD_GROUND', player, animation: 'dead_ground' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
		player.scene.time.delayedCall(3000, () => {
			player.scene.theme.stop();
			if (player.continue === 0) {
				player.scene.theme = player.scene.sound.add(`death`);
				player.scene.theme.setVolume(0.2).play();
				player.scene.scene.start('GameOver');
				return
			}
			player.continue--;
			player.scene.scene.restart({ level: player.scene.currentLevel, playerData: player.getPlayerData() })
		});
	}
	handleInput() {
	}
}

export class DoorIn extends State {
	constructor(player) {
		super({ name: 'DOOR_IN', player, animation: 'door_in' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
	}
	handleInput() {
	}
}

export class DoorOut extends State {
	constructor(player) {
		super({ name: 'DOOR_OUT', player, animation: 'door_out' });
	}
	enter() {
		const { player } = this;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'door_out', function (anims) {
			player.setState('IDLE');
		}, this);
	}
	handleInput() {
	}
}