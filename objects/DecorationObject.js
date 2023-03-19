class DecorationObject extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, flipX }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setFlipX(flipX);
	}

}