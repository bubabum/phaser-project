export class DecorationObject extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, flipX = false }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setOrigin(0.5, 1).setFlipX(flipX).setDepth(7);

	}

}