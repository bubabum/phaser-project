class Sword extends Phaser.Physics.Arcade.Sprite {

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

}