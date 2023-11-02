class Bomb extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setCircle(15);
		this.setOffset(34, 58);
		this.setOrigin(0.51, 0.67);
		this.setDepth(25)
		this.createAnimations(textureKey);
		this.isOff = false;
		this.exploded = false;
		this.body.gameObject = this;
		if (scene.hasLight) this.setPipeline('Light2D')
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (!this.body) return
		if (!this?.body.onFloor()) this.setDragX(80);
		if (this?.body.onFloor()) this.setDragX(400);
	}

	throw(velocity, player) {
		this.anims.play('on');
		this.exploded = false;
		this.setPosition(player.x + (player.flipX ? -10 : 10), player.y);
		this.setVelocity((player.flipX ? -1 : 1) * velocity * 0.75, -velocity);
		this.scene.time.delayedCall(2000, () => this.explode());
	}

	push(object) {
		if (!this.exploded) return
		const point = {
			x: this.x + (this.x < object.x ? -100 : 100),
			y: this.y + 200,
		}
		const angle = Phaser.Math.Angle.BetweenPoints(point, this);
		this.scene.physics.velocityFromRotation(angle, 150, object.body.velocity);
		// object.setAngularDrag(1000)
		// object.setAngularVelocity(
		// 	Phaser.Math.RadToDeg(object.body.velocity.x / object.body.halfWidth)
		// );
	}

	explode() {
		if (this.isOff) return
		this.anims.play('explosion');
		this.exploded = true;
		this.body.moves = false;
		this.scene.cameras.main.shake(150, 0.005);
		this.setCircle(48);
		this.setOffset(0, 12);
		this.setOrigin(0.5, 0.5);
		this.scene.time.delayedCall(100, () => this.body.destroy());
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'explosion', function (anims) {
			this.destroy();
		}, this);
	}

	turnOff() {
		this.isOff = true;
		this.setVelocityX(0);
		this.anims.play('off');
		this.scene.time.delayedCall(1000, () => this.destroy());
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'on',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 9 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'explosion',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 10, end: 18 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'off',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 19, end: 19 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}