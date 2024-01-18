export class Candle extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		this.setDepth(2);
		this.light = scene.add.sprite(x, y - 30, `${textureKey}_light`);
		this.light.setDepth(3);
		this.createAnimations(textureKey);
		this.anims.play('idle');
		this.light.anims.play('idle');
		scene.lights.addLight(this.x, this.y, 300, 0xaaaaaa, 1);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 7 }),
			frameRate: 20,
			repeat: -1,
		});
		this.light.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(`${textureKey}_light`, { start: 0, end: 4 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}