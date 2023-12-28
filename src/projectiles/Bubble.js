export class Bubble extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCircle(11);
		this.setDepth(25);
		this.createAnimations(textureKey);
		this.anims.play('idle');
		scene.time.delayedCall(10000, () => this.destroy());
		if (scene.hasLight) {
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

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}