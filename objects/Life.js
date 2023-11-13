class Life extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setPosition(this.getTileCenterX(x), y);
		this.setDepth(25);
		this.isActive = false;
		this.createAnimations(textureKey);
		this.anims.play('idle');
	}

	getTileCenterX(x) {
		const { tileWidth } = this.scene.tileset;
		return Math.floor(x / tileWidth) * tileWidth + tileWidth / 2;
	}

	disappear() {
		this.isActive = true;
		this.anims.play('effect');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'effect', function (anims) {
			this.destroy();
		}, this);
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