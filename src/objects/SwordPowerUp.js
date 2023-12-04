import { Collectible } from './Collectible';

export class SwordPowerUp extends Collectible {

	constructor({ scene, x, y, textureKey, type = 'sword' }) {
		super({ scene, x, y, textureKey, type });
		this.setSize(17, 26);
		this.setOffset(6, 3);
		this.type = type;
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 8 }),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: 'effect',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 9, end: 15 }),
			frameRate: 10,
			repeat: 0,
		});
	}

}