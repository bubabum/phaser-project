export class FadingPlatform extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setOrigin(0, 0);
		this.setSize(64, 1);
		this.setOffset(0, 0);
		this.body.checkCollision.down = false;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.setDepth(6);
	}

	fade() {
		this.scene.time.delayedCall(300, () => {
			this.disableBody(false, true);
		});
		this.scene.time.delayedCall(1500, () => {
			this.enableBody(false, this.x, this.y, true, true);
		});
	}

}