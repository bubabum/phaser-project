class Life extends Collectible {

	constructor({ scene, x, y, textureKey, type }) {
		super({ scene, x, y, textureKey, type });
		scene.add.existing(this);
		scene.physics.add.existing(this);
		//this.setPosition(this.getTileCenterX(x), y);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 21 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'effect',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 22, end: 25 }),
			frameRate: 10,
			repeat: 0,
		});
	}

}