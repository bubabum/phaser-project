// class State {
// 	constructor(name, player, animation) {
// 		this.name = name;
// 		this.player = player;
// 		this.animation = animation;
// 	}
// }

class Idle extends State {
	constructor(player) {
		super({ name: 'IDLE', player, animation: 'idle' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		if (cursors.right.isDown || cursors.left.isDown) this.player.setState('RUN');
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.player.setState('JUMP');
		if (this.player.body.velocity.y > 0) this.player.setState('JUMP');
	}
}

class Run extends State {
	constructor(player) {
		super({ name: 'RUN', player, animation: 'run' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		if (cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
			this.player.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.player.setState('JUMP');
		if (this.player.body.velocity.y > 0) this.player.setState('FALL');
	}
}

class Jump extends State {
	constructor(player) {
		super({ name: 'JUMP', player, animation: 'jump' });
	}
	enter() {
		this.player.setVelocityY(-250);
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
		}
		if (this.player.body.velocity.y > 0) this.player.setState('FALL');
	}
}

class Fall extends State {
	constructor(player) {
		super({ name: 'FALL', player, animation: 'fall' });
	}
	enter() {
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
		}
		if (this.player.body.blocked.down) this.player.setState('LAND');
	}
}

class Land extends State {
	constructor(player) {
		super({ name: 'LAND', player, animation: 'land' });
	}
	enter() {
		this.player.setVelocityX(0);
		this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
			this.player.setState('IDLE');
		}, this);
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown || cursors.left.isDown) this.player.setState('RUN');
	}
}

class Hit extends State {
	constructor(player) {
		super({ name: 'HIT', player, animation: 'hit' });
	}
	enter() {
		const { player } = this;
		player.health--;
		player.isInvulnerable = true;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit', function (anims) {
			player.setState('FALL');
		}, this);
		if (player.health === 0) player.scene.scene.restart();
		setTimeout(() => this.player.isInvulnerable = false, 1000)
	}
	handleInput() {

	}
}

class DeadHit extends State {
	constructor(player) {
		super({ name: 'DEAD_HIT', player, animation: 'dead_hit' });
	}
	enter() {
		const { player } = this;
		// player.health--;
		player.setVelocity(0);
		player.isInvulnerable = true;
		// player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit', function (anims) {
		// 	player.setState('FALL');
		// }, this);
		// if (player.health === 0) player.scene.scene.restart();
		// setTimeout(() => this.player.isInvulnerable = false, 1000)
	}
	handleInput() {

	}
}

class DoorIn extends State {
	constructor(player) {
		super({ name: 'DOOR_IN', player, animation: 'door_in' });
	}
	enter() {
		this.player.setVelocityX(0);
	}
	handleInput() {
	}
}

class DoorOut extends State {
	constructor(player) {
		super({ name: 'DOOR_OUT', player, animation: 'door_out' });
	}
	enter() {
		this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'door_out', function (anims) {
			this.player.setState('IDLE');
		}, this);
	}
	handleInput() {
	}
}