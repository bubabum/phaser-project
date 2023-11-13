class Player extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textures }) {
		super(scene, x, y - 25, textures.player);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setDepth(23);
		this.setSize(25, 50);
		this.setOffset(20, 8);
		this.setDepth(23);
		this.maxHeath = 3;
		this.health = this.maxHeath;
		this.jumpVelocity = -250;
		this.bombMaxVelocity = 300;
		this.isInvulnerable = false;
		this.hasKey = false;
		this.bombBar = new BombBar({ scene: scene, player: this, textureKey: textures.bombBar });
		this.bombGroup = scene.physics.add.group({
			defaultKey: 'bomb',
			classType: Bomb,
			maxSize: 3,
			bounceX: 0.7,
			bounceY: 0.7,
			dragX: 80,
			dragY: 80,
			gravityY: 0,
		});

		this.swordGroup = scene.physics.add.group({
			defaultKey: 'sword',
			classType: Sword,
			maxSize: 1,
			allowGravity: false,
		});

		this.cursors = scene.input.keyboard.createCursorKeys();
		this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.particles = new ParticlesGroup({ scene: this.scene, textures: textures.particles, emitter: this });

		this.createAnimations(textures.player);

		this.states = [
			new Idle(this),
			new Run(this),
			new Jump(this),
			new Fall(this),
			new Land(this),
			new Hit(this),
			new DeadHit(this),
			new DeadGround(this),
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

	update() {
		// if (this.lastState !== this.currentState.name) {
		// 	this.lastState = this.currentState.name;
		// 	console.log(this.lastState);
		// }
		// if (this.stateName) this.stateName.destroy();
		// this.stateName = this.scene.add.text(this.x, this.y - 70, `${this.currentState.name} ${Math.floor(this.body.velocity.y)}`, { font: '16px Courier', fill: '#ffffff' });
		// this.stateName.x -= this.stateName.width * 0.5

		const { currentState, cursors, keyUp } = this;
		this.handleSwordListener()
		//this.handleBombListener()
		if (this.touchingPlatform && this.currentState.name !== 'JUMP' && this.currentState.name !== 'FALL') {
			const platformVelocityY = this.touchingPlatform.body.velocity.y;
			if (platformVelocityY > 0) {
				//Phaser.Display.Bounds.SetBottom(this, this.touchingPlatform.body.top);
				this.setVelocityY(platformVelocityY);
			}
		}
		currentState.handleInput({ cursors, keyUp });
	}

	setInvulnerability(status) {
		this.isInvulnerable = status;
	}

	addLife() {
		if (this.health === this.maxHeath) return
		this.health++
		return true
	}

	getKey() {
		this.hasKey = true;
	}

	handleBombListener() {
		const { bombBar, keySpace } = this;
		bombBar.update();
		if (Phaser.Input.Keyboard.JustDown(keySpace)) this.chargeBomb();
		if (Phaser.Input.Keyboard.JustUp(keySpace)) this.throwBomb();
	}

	handleSwordListener() {
		const { keySpace } = this;
		if (Phaser.Input.Keyboard.JustUp(keySpace)) this.throwSword();
	}

	chargeBomb() {
		if (this.bombGroup.getChildren().length === this.bombGroup.maxSize || this.isInvulnerable) return
		this.bombBar.startCharging();
	}

	throwBomb() {
		if (!this.bombBar.isVisible()) return
		const bomb = this.bombGroup.get();
		if (bomb) bomb.throw(this.bombMaxVelocity * this.bombBar.stopCharging(), this);
	}

	throwSword() {
		const sowrd = this.swordGroup.get();
		if (sowrd) sowrd.throw(this);
	}

	takeDamage() {
		if (this.isInvulnerable) return
		if (this.health === 1) {
			this.setState('DEAD_HIT');
		} else {
			this.setState('HIT');
		}
		this.health--;
		this.isInvulnerable = true;
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
		this.anims.create({
			key: 'jump_anticipation',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 40, end: 40 }),
			frameRate: 20,
			repeat: 0,
		});
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
			frameRate: 10,
			repeat: -1,
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