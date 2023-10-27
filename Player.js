class Player extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y - 25, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setDepth(1);
		this.setSize(25, 50);
		this.setOffset(20, 8);
		this.health = 5;
		this.isInvulnerable = false;
		this.bombMaxVelocity = 300;

		this.bombBar = new BombBar({ scene: scene, player: this, textureKey: 'bomb_bar' });
		this.bombGroup = scene.physics.add.group({
			defaultKey: 'bomb',
			classType: Bomb,
			maxSize: 3,
			bounceX: 1,
			bounceY: 0.5,
			dragX: 80,
			dragY: 20,
		});

		this.createAnimations(textureKey);
		this.states = [
			new Idle(this),
			new Run(this),
			new Jump(this),
			new Fall(this),
			new Land(this),
			new Hit(this),
			new DoorIn(this),
			new DoorOut(this),
		];
		this.setState('DOOR_OUT');

		if (scene.hasLight) this.light = scene.lights.addLight(this.x, this.y, 700, 0xffffff, 0.9);

	}

	setState(name) {
		if (this?.currentState?.name === name) return
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
		this.anims.play(this.currentState.animation);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.light) {
			this.light.x = this.x;
			this.light.y = this.y;
		}
		if (this?.body?.velocity?.x < 0) {
			this.flipX = true;
			this.setOffset(13, 8);
		}
		if (this?.body?.velocity?.x > 0) {
			this.flipX = false;
			this.setOffset(20, 8);
		}
	}

	handleBombListener() {
		this.bombBar.update();
		if (Phaser.Input.Keyboard.JustDown(keySpace)) this.chargeBomb();
		if (Phaser.Input.Keyboard.JustUp(keySpace)) this.throwBomb();
	}

	chargeBomb() {
		if (this.bombGroup.getChildren().length === this.bombGroup.maxSize) return
		this.bombBar.startCharging();
	}

	throwBomb() {
		if (!this.bombBar.isVisible()) return
		const bomb = this.bombGroup.get();
		if (bomb) bomb.throw(this.bombMaxVelocity * this.bombBar.stopCharging(), this)
	}

	takeDamage(object) {
		if (this.isInvulnerable) return
		this.setState('HIT');
		object.push(this);
	}

	takeBombDamage(bomb) {
		if (!bomb.exploded || this.isInvulnerable) return
		this.setState('HIT');
		bomb.push(this);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 25 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
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
			key: 'jump',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 41, end: 44 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'fall',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 45, end: 46 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'land',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 47, end: 49 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 50, end: 57 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 63 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 64, end: 67 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'door_in',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 68, end: 83 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'door_out',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 84, end: 99 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}