class Idle extends State {
	constructor(carrier) {
		super('IDLE', carrier);
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		if (cursors.right.isDown || cursors.left.isDown) this.carrier.setState('RUNNING');
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.carrier.setState('JUMPING');
		if (this.carrier.body.velocity.y > 0) this.carrier.setState('FALLING');
	}
}

class Running extends State {
	constructor(carrier) {
		super('RUNNING', carrier);
	}
	enter() {
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.carrier.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.carrier.setVelocityX(-160);
		} else {
			this.carrier.setVelocityX(0);
			this.carrier.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(keyUp)) this.carrier.setState('JUMPING');
		if (this.carrier.body.velocity.y > 0) this.carrier.setState('FALLING');
	}
}

class Jumping extends State {
	constructor(carrier) {
		super('JUMPING', carrier);
	}
	enter() {
		this.carrier.setVelocityY(-250);
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.carrier.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.carrier.setVelocityX(-160);
		} else {
			this.carrier.setVelocityX(0);
		}
		if (this.carrier.body.velocity.y > 0) this.carrier.setState('FALLING');
	}
}

class Falling extends State {
	constructor(carrier) {
		super('FALLING', carrier);
	}
	enter() {
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.carrier.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.carrier.setVelocityX(-160);
		} else {
			this.carrier.setVelocityX(0);
		}
		if (this.carrier.body.blocked.down) this.carrier.setState('LANDING');
	}
}

class Landing extends State {
	constructor(carrier) {
		super('LANDING', carrier);
	}
	enter() {
		this.carrier.setVelocityX(0);
		this.carrier.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'LANDING', function (anims) {
			this.carrier.setState('IDLE');
		}, this);
	}
	handleInput({ cursors }) {
		if (cursors.right.isDown) {
			this.carrier.setVelocityX(160);
		} else if (cursors.left.isDown) {
			this.carrier.setVelocityX(-160);
		} else {
			this.carrier.setVelocityX(0);
		}
	}
}

class Hit extends State {
	constructor(carrier) {
		super('HIT', carrier);
	}
	enter() {
		this.carrier.setPosition(this.carrier.x, this.carrier.y - 100);
		this.carrier.setVelocityY(-250);
		setTimeout(() => this.carrier.setState('FALLING'), 300);
	}
	handleInput() {
		console.log(this.carrier.body.velocity.y)
		// this.carrier.flipX = !this.carrier.flipX;
	}
}