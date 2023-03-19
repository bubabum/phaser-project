class Canon extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.shootInterval = 2000;
		this.ballSpeed = 300;
		this.bodyProperties = { width: 50, height: 42, offsetX: 5, offsetY: 2, flipOffsetX: 5 };
		this.isInvulnerable = true;
		this.isAtacking = false;
		this.setBodyProperties(direction);
		this.createAnimations(textureKey);
		this.states = [
			new CanonIdle(this),
			new CanonShoot(this),
		];
		this.setState('IDLE');
	}

	shoot() {
		this.isAtacking = true;
		const canonBall = this.canonBallGroup.get();
		if (canonBall) canonBall.fly(this.x, this.y, this.ballSpeed, this.direction);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 0 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'shoot',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 1, end: 9 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}