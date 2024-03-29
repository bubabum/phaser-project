export class CanonBall extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCircle(15);
		this.setDepth(25);
		if (scene.hasLight && scene.isWindows) {
			this.setPipeline('Light2D');
			this.light = scene.lights.addLight(this.x, this.y, 300, 0xaaaaaa, 0.3);
		}
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt)
		if (this.light) {
			this.light.x = this.x;
			this.light.y = this.y;
		}
	}

	fly(x, y, speed, direction) {
		this.setPosition(x + (direction === 'right' ? -15 : 15), y);
		this.setVelocityX(direction === 'right' ? -speed : speed);
	}

}