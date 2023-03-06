class Player extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.states = [
			new Idle(this),
			new Running(this),
			new Jumping(this),
			new Falling(this),
			new Landing(this),
			new Hit(this),
		];
		this.createAnimations(textureKey);
		this.setState('IDLE');
		this.setSize(25, 50);
		this.setOffset(20, 8);
		this.health = 1;
		this.start();
	}

	start() {
		this.anims.play('DOOR_OUT');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'DOOR_OUT', function (anims) {
			this.setState('RUNNING');
			this.setState('IDLE');
		}, this);
	}

	setState(name) {
		if (this?.currentState?.name === name) return
		this.currentState = this.states.find(state => state.name === name);
		this.anims.play(name);
		this.currentState.enter();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this?.body?.velocity?.x < 0) {
			this.flipX = true;
			this.setOffset(13, 8);
		}
		if (this?.body?.velocity?.x > 0) {
			this.flipX = false;
			this.setOffset(20, 8);
		}
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'IDLE',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 25 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'RUNNING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 26, end: 39 }),
			frameRate: 20,
			repeat: -1,
		});
		// this.anims.create({
		// 	key: 'jump_anticipation',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 40, end: 40 }),
		// 	frameRate: 20,
		// 	repeat: 0,
		// });
		this.anims.create({
			key: 'JUMPING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 41, end: 44 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'FALLING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 45, end: 46 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'LANDING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 47, end: 49 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'HIT',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 50, end: 57 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'DEAD_HIT',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 63 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'DEAD_GROUND',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 64, end: 67 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'DOOR_IN',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 68, end: 83 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'DOOR_OUT',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 84, end: 99 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}