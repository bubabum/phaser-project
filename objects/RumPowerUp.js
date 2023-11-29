class RumPowerUp extends Collectible {

	constructor({ scene, x, y, textureKey, type = 'rum' }) {
		super({ scene, x, y, textureKey, type, });
		this.setSize(14, 26);
		this.setOffset(9, 2);
		this.type = type;
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 11 }),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: 'effect',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 12, end: 16 }),
			frameRate: 10,
			repeat: 0,
		});
	}

}