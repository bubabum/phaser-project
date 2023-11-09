class Spike extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setDepth(25);
		this.setSize(60, 4);
		this.setOffset(2, 60);
		this.setOrigin(0, 0);
		if (scene.hasLight) this.setPipeline('Light2D');
	}

}