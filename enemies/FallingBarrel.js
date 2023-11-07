class FallingBarrel extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setSize(42, 44);
		this.setOffset(11, 16);
		this.setOrigin(0.5, 0.5);
		this.body.setAllowGravity(false);
		this.anims.createFromAseprite(textureKey);
		this.anims.play({ key: 'Idle', repeat: -1 });
		scene.time.delayedCall(3000, () => this.fall());
		if (scene.hasLight) this.setPipeline('Light2D');
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.body.onFloor() && !this.landed) {
			this.brake();
			this.landed = true;
		}
	}

	fall() {
		this.body.setAllowGravity(true);
		this.setVelocityY(250)
		this.anims.play({ key: 'Fall', repeat: -1 });
	}

	brake() {
		this.anims.play('Brake');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Brake', function (anims) {
			this.setVisible(false); // destroy
		}, this);
	}

}