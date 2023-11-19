class Door extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, id }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setSize(10, 30);
		this.setOffset(35, 60);
		this.id = Number(id);
		this.createAnimations(textureKey);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'closed',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 0 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'opening',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 1, end: 5 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'closing',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 2, end: 10 }),
			frameRate: 10,
			repeat: 0,
		});
	}

}