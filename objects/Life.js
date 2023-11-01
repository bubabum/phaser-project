class Life extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setPosition(this.getTileCenterX(x))
		this.createAnimations(textureKey);
		this.anims.play('idle');
	}

	getTileCenterX(x) {
		const { tileWidth } = this.scene.tileset;
		return Math.floor(x / tileWidth) * tileWidth + tileWidth / 2;
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 21 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}