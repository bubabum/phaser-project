class Key extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setDepth(25);
		this.centerKey();
		this.setOrigin(0.5, 0.5)
		this.createAnimations(textureKey);
		this.anims.play('idle');
	}

	centerKey() {
		const { tileWidth, tileHeight } = this.scene.tileset;
		const x = Math.floor(this.x / tileWidth) * tileWidth + tileWidth / 2;
		const y = Math.floor(this.y / tileHeight) * tileHeight + tileHeight / 2;
		this.setPosition(x, y)
	}

	disappear() {
		this.anims.play('effect');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'effect', function (anims) {
			this.destroy();
		}, this);
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