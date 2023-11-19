class Key extends PowerUp {

	constructor({ scene, x, y, textureKey, id }) {
		super({ scene, x, y, textureKey });
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.id = id;
		this.setPosition(...this.getTileCenter());
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'effect',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: 0,
		});
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 4, end: 11 }),
			frameRate: 10,
			repeat: -1,
		});
	}

}