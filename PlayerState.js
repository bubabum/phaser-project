class Idle extends State {
	constructor(player) {
		super({ name: 'IDLE', player, animation: 'idle' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (cursors.right.isDown || cursors.left.isDown) player.setState('RUN');
		if (Phaser.Input.Keyboard.JustDown(keyUp)) player.setState('JUMP');
	}
}

class Run extends State {
	constructor(player) {
		super({ name: 'RUN', player, animation: 'run' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-160);
		} else {
			player.setVelocityX(0);
			player.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(keyUp)) player.setState('JUMP');
		if (player.body.velocity.y > 0 && !player.touchingPlatform || !player.body.onFloor()) player.setState('FALL');
	}
}

class Jump extends State {
	constructor(player) {
		super({ name: 'JUMP', player, animation: 'jump' });
	}
	enter() {
		const { player } = this;
		player.setVelocityY(player.jumpVelocity);
		player.touchingPlatform = null;
	}
	handleInput({ cursors }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-160);
		} else {
			player.setVelocityX(0);
		}
		if (player.body.velocity.y > 0) player.setState('FALL');
		if (player.body.onFloor() && player.touchingPlatform) player.setState('LAND');
	}
}

class Fall extends State {
	constructor(player) {
		super({ name: 'FALL', player, animation: 'fall' });
	}
	enter() {
		const { player } = this;
		player.setVelocityY(0);
		player.touchingPlatform = null;
	}
	handleInput({ cursors }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-160);
		} else {
			player.setVelocityX(0);
		}
		if (player.body.blocked.down) player.setState('LAND');
	}
}

class Land extends State {
	constructor(player) {
		super({ name: 'LAND', player, animation: 'land' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
			player.setState('IDLE');
		}, this);
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (cursors.right.isDown || cursors.left.isDown) player.setState('RUN');
	}
}

class Hit extends State {
	constructor(player) {
		super({ name: 'HIT', player, animation: 'hit' });
	}
	enter() {
		const { player } = this;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit', function (anims) {
			player.setState('FALL');
			player.setInvulnerability(false)
		}, this);
	}
	handleInput() {

	}
}

class DeadHit extends State {
	constructor(player) {
		super({ name: 'DEAD_HIT', player, animation: 'dead_hit' });
	}
	enter() {
	}
	handleInput() {
		const { player } = this;
		if (player.body.velocity.y === 0) player.setState('DEAD_GROUND');
	}
}

class DeadGround extends State {
	constructor(player) {
		super({ name: 'DEAD_GROUND', player, animation: 'dead_ground' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
		player.scene.time.delayedCall(3000, () => player.scene.scene.restart());
	}
	handleInput() {
	}
}

class DoorIn extends State {
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

class DoorOut extends State {
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