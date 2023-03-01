class State {
	constructor(name, player) {
		this.name = name;
		this.player = player;
	}
}

class Idle extends State {
	constructor(player) {
		super('IDLE', player);
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		if (cursors.right.isDown || cursors.left.isDown) this.player.setState('RUNNING');
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.player.setState('JUMPING');
		if (this.player.body.velocity.y > 0) this.player.setState('FALLING');
	}
}

class Running extends State {
	constructor(player) {
		super('RUNNING', player);
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
			this.player.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.player.setState('JUMPING');
		if (this.player.body.velocity.y > 0) this.player.setState('FALLING');
	}
}

class Jumping extends State {
	constructor(player) {
		super('JUMPING', player);
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
		if (this.player.body.velocity.y > 0) this.player.setState('FALLING');
	}
}

class Falling extends State {
	constructor(player) {
		super('FALLING', player);
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
		if (this.player.body.blocked.down) this.player.setState('LANDING');
	}
}

class Landing extends State {
	constructor(player) {
		super('LANDING', player);
	}
	enter() {
		this.player.setVelocityX(0);
		this.player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'LANDING', function (anims) {
			this.player.setState('IDLE');
		}, this);
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.player.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
		}
	}
}

class Hit extends State {
	constructor(player) {
		super('HIT', player);
	}
	enter() {
		this.player.flipX = !this.player.flipX;
		setTimeout(() => this.player.setState('FALLING'), 300);
	}
	handleInput({ cursors }) {
	}
}