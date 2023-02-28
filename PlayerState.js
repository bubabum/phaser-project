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
	handleInput(input, up) {
		if (input.right.isDown || input.left.isDown) this.player.setState('RUNNING');
		if (Phaser.Input.Keyboard.JustDown(up)) this.player.setState('JUMPING');
		if (this.player.body.velocity.y > 0) this.player.setState('FALLING');
	}
}

class Running extends State {
	constructor(player) {
		super('RUNNING', player);
	}
	enter() {
	}
	handleInput(input) {
		if (input.right.isDown) {
			this.player.setVelocityX(160);
		} else if (input.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
			this.player.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(up)) this.player.setState('JUMPING');
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
	handleInput(input) {
		if (input.right.isDown) {
			this.player.setVelocityX(160);
		} else if (input.left.isDown) {
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
	handleInput(input) {
		if (input.right.isDown) {
			this.player.setVelocityX(160);
		} else if (input.left.isDown) {
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
	handleInput(input) {
		if (input.right.isDown) {
			this.player.setVelocityX(160);
		} else if (input.left.isDown) {
			this.player.setVelocityX(-160);
		} else {
			this.player.setVelocityX(0);
		}
	}
}