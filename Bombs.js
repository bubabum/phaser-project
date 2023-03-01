class Bomb extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		//this.scene = scene;
		this.createAnimations(textureKey);
	}

	throw(velocityRatio) {
		this.anims.play('ON');
		let velocity = BOMB_MAX_VELOCITY * velocityRatio;
		this.setPosition(player.x + (player.flipX ? -10 : 10), player.y);
		this.setVelocity((player.flipX ? -1 : 1) * velocity, -velocity);
		this.setCircle(15);
		this.setOffset(34, 58);
		this.setOrigin(0.51, 0.67);
		this.setBounce(0.7);
		this.setDrag(20, 20);
		setTimeout(() => this.explode(), 2000)
	}

	explode() {
		this.anims.play('EXPLOSION');
		this.setVelocity(0);
		this.body.moves = false;
		this.setCircle(48);
		this.setOffset(0, 12);
		this.setOrigin(0.5, 0.5);
		let playerCollider = this.scene.physics.add.collider(bombs, player, (player, bomb) => {
			player.setState('HIT');
			const angle = Phaser.Math.Angle.BetweenPoints(bomb.getCenter(), player.getCenter());
			this.scene.physics.velocityFromRotation(angle, 200, player.body.velocity);
			this.scene.physics.world.removeCollider(playerCollider);
		});
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'EXPLOSION', function (anims) {
			this.destroy();
		}, this);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'ON',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 9 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'EXPLOSION',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 10, end: 19 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}

class Bombs extends Phaser.Physics.Arcade.Group {
	constructor({ scene, textureKey }) {
		super(scene.physics.world, scene);
		this.defaultKey = textureKey;
		this.classType = Bomb;
		this.maxSize = 3;
		// this.createMultiple({
		// 	quantity: 3,
		// 	max: 3,
		// 	key: textureKey,
		// 	active: false,
		// 	// visible: false,
		// 	classType: Bomb,
		// });
	}

	throwBomb(velocityRatio) {
		let bomb = this.create();
		//let bomb = this.get();
		if (bomb) bomb.throw(velocityRatio);
	}

}