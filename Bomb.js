class Bomb extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setCircle(15);
		this.setOffset(34, 58);
		this.setOrigin(0.51, 0.67);
		this.createAnimations(textureKey);
		this.body.gameObject = this;
		if (scene.hasLight) this.setPipeline('Light2D')
	}

	throw(velocity, player) {
		this.anims.play('on');
		this.exploded = false;
		this.setPosition(player.x + (player.flipX ? -10 : 10), player.y);
		this.setVelocity((player.flipX ? -1 : 1) * velocity, -velocity);
		setTimeout(() => this.explode(), 2000)
	}

	push(object) {
		if (!this.exploded) return
		const point = {
			x: this.x + (this.x < object.x ? -100 : 100),
			y: this.y + 200,
		}
		const angle = Phaser.Math.Angle.BetweenPoints(point, this);
		this.scene.physics.velocityFromRotation(angle, 150, object.body.velocity);
	}

	explode() {
		this.anims.play('explosion');
		this.exploded = true;
		this.scene.cameras.main.shake(150, 0.005);
		this.body.moves = false;
		this.setCircle(48);
		this.setOffset(0, 12);
		this.setOrigin(0.5, 0.5);
		setTimeout(() => this.body.destroy(), 100)
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'explosion', function (anims) {
			this.destroy();
		}, this);
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