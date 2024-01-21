export class Seed extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.speed = 400;
		this.setDepth(25);
		this.createAnimations(textureKey);
		this.anims.play('idle')
		if (scene.hasLight && scene.isWindows) {
			this.setPipeline('Light2D');
			this.light = scene.lights.addLight(this.x, this.y, 300, 0xaaaaaa, 0.3);
		}
	}

	preUpdate(t, dt) {
		super.preUpdate(t, dt)
		if (this.light) this.light.setPosition(this.x, this.y)
		this.setFlipX(this.body.velocity.x > 0)
	}

	fly(x, y, direction, speed = this.speed) {
		this.setPosition(x, y);
		this.setVelocityX(direction === 'right' ? speed : -speed);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 7 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}