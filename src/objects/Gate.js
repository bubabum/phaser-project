export class Gate extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, status }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setDepth(12);
		this.createAnimations(textureKey);
		this.setStatus(status);
	}

	setStatus(status) {
		if (status === 'OPENED') return this.open();
		this.close()
	}

	close() {
		this.enableBody();
		this.anims.play('closing');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'closing', () => {
			this.anims.play('closed');
		}, this);
	}

	open() {
		this.anims.play('opening');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'opening', () => {
			this.disableBody();
			this.anims.play('opened');
		}, this);

	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'closed',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 0 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'opened',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 8, end: 8 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'opening',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 1, end: 7 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'closing',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 7, end: 1 }),
			frameRate: 10,
			repeat: 0,
		});
	}

}