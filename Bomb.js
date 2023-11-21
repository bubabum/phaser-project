class Bomb extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCircle(15);
		this.setOffset(34, 58);
		this.setOrigin(0.51, 0.67);
		this.setDepth(25);
		this.createAnimations(textureKey);
		this.setMass(1);
		this.isOff = false;
		this.exploded = false;
		this.body.gameObject = this;
		if (scene.hasLight) this.setPipeline('Light2D')
	}

	update(player) {
		this.setPosition(player.x + (player.flipX ? -30 : 30), player.y);
	}

	prepare(player) {
		this.anims.play('on');
		this.exploded = false;
		this.body.setAllowGravity(false);
	}

	throw(velocity, player) {
		this.scene.physics.add.collider(player, this);
		this.body.setAllowGravity(true);
		this.setVelocity((player.flipX ? -1 : 1) * velocity, -velocity);
		this.scene.time.delayedCall(2000, () => this.explode());
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