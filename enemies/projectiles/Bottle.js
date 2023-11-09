class Bottle extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCircle(10);
		this.setDepth(25);
		if (scene.hasLight) this.setPipeline('Light2D');
	}

	fly(x, y, speed, direction) {
		this.setPosition(x, y);
		this.setVelocityX(direction === 'right' ? -speed : speed);
	}

}