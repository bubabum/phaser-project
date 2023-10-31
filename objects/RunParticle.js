class RunParticle extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		this.setOrigin(1, 1);
		this.createAnimations(textureKey);
		this.anims.play('idle');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'idle', function (anims) {
			this.destroy();
		}, this);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 5 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}