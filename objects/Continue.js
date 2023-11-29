class Continue extends Collectible {

	constructor({ scene, x, y, textureKey, type }) {
		super({ scene, x, y, textureKey, type });
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setSize(28, 28);
		this.setOffset(19, 19)
		//this.setPosition(this.getTileCenterX(x), y);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 18 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'effect',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 19, end: 28 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}