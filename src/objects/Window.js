export class Window extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		this.setDepth(2);
		this.light = scene.add.sprite(x + 20, y - 20, `${textureKey}_light`);
		this.light.setOrigin(1, 0);
		this.light.setDepth(3);
		this.createAnimations(textureKey);
		this.light.setFlipX(true);
		this.light.anims.play('idle');
	}

	createAnimations(textureKey) {
		this.light.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(`${textureKey}_light`, { start: 0, end: 3 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}