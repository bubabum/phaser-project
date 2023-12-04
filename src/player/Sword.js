export class Sword extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setCircle(10);
		//this.setOffset(34, 58);
		//this.setOrigin(0.51, 0.67);
		this.setDepth(25);
		if (scene.hasLight) this.setPipeline('Light2D')
	}

	throw(player) {
		this.setPosition(player.x + (player.flipX ? -10 : 10), player.y);
		this.setVelocityX((player.flipX ? -1 : 1) * 500);
		this.setAngularVelocity((player.flipX ? -1 : 1) * 1000);
	}
}