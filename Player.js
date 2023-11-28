class Player extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textures, playerData }) {
		super(scene, x, y - 25, textures.player);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setDepth(23);
		this.setSize(25, 50);
		this.setOffset(20, 8);
		this.setDepth(23);
		this.setGravityY(400);
		this.setMass(1);
		this.setFriction(1, 1)
		this.maxHeath = 3;
		this.continue = playerData.continue;
		this.health = playerData.health;
		this.inventoryData = playerData.inventory;
		this.collected = playerData.collected;
		this.activeItem = 0;
		this.runVelocity = 175;
		this.jumpVelocity = -400;
		this.bombMaxVelocity = 300;
		this.madeDoubleJump = false;
		this.isInvulnerable = false;
		this.hasActiveRum = false;
		this.jumpGap = false;
		this.activeBomb = null;
		this.bombBar = new BombBar({ scene: scene, player: this, textureKey: textures.bombBar });
		this.inventory = new Inventory({ scene: scene, player: this, textures })
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

		this.particles = new ParticlesGroup({ scene: this.scene, textures: textures.particles, emitter: this });

		this.createAnimations(textures.player);

		this.states = [
			new Idle(this),
			new Run(this),
			new Dash(this),
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

		if (scene.hasLight) this.light = scene.lights.addLight(this.x, this.y, 700).setColor(0xaaaaaa).setIntensity(0.9);

	}

	setState(name) {
		if (this?.currentState?.name === name) return
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
		this.anims.play(this.currentState.animation);
	}

	update({ controller }) {
		this.activeBomb && this.activeBomb.update(this);
		if (this.body.velocity.y > 300) this.setVelocityY(300);
		// if (this.lastState !== this.currentState.name) {
		// 	this.lastState = this.currentState.name;
		// 	console.log(this.lastState);
		// }
		// if (this.stateName) this.stateName.destroy();
		// this.stateName = this.scene.add.text(this.x, this.y - 70, `${this.currentState.name} ${Math.floor(this.body.velocity.y)}`, { font: '16px Courier', fill: '#ffffff' });
		// this.stateName.x -= this.stateName.width * 0.5

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
		const { currentState } = this;
		const { useBomb, useSword, useRum } = controller.buttons;
		this.bombBar.update();
		if (useBomb.justDown) this.chargeBomb();
		if (useBomb.justUp) this.throwBomb();
		if (useSword.justDown) this.throwSword();
		if (useRum.justDown) this.activateRum();

		if (this.touchingPlatform && this.currentState.name !== 'JUMP' && this.currentState.name !== 'FALL') {
			const platformVelocityY = this.touchingPlatform.body.velocity.y;
			if (platformVelocityY > 0) {
				this.setVelocityY(platformVelocityY);
			}
		}

		currentState.handleInput({ controller });
		this.inventory.update();
	}

	getPlayerData(death = true) {
		return {
			continue: this.continue,
			health: death ? this.maxHeath : this.health,
			inventory: this.inventoryData,
			collected: this.collected,
		}
	}

	isDead() {
		return this.health === 0
	}

	setInvulnerability(status, effect = false) {
		this.isInvulnerable = status;
		if (effect === false) {
			if (this.invulnerabilityEffect) this.invulnerabilityEffect.remove();
			this.setAlpha(1);
			return this
		}
		if (status === true) {
			this.invulnerabilityEffect = this.scene.tweens.add({
				targets: this,
				duration: 100,
				ease: 'Linear',
				alpha: {
					getStart: () => 0.2,
					getEnd: () => 1,
				},
				repeat: -1,
			});
		} else {
			this.invulnerabilityEffect.remove();
			this.setAlpha(1);
		}
		return this
	}


	addContinue(id) {
		if (this.isDead()) return
		this.continue++
		this.collected.continues.add(id);
		return true
	}

	addLife(id) {
		if (this.health === this.maxHeath || this.isDead()) return
		this.health++
		this.collected.lives.add(id);
		return true
	}

	addPowerUp(type) {
		if (this.inventoryData[type] === 99 || this.isDead()) return
		this.inventoryData[type]++;
		return true
	}

	getKey(id) {
		this.collected.keys.add(id);
	}

	// handleBombListener(button) {
	// 	const { bombBar } = this;
	// 	bombBar.update();
	// 	if (button.justDown) this.chargeBomb();
	// 	if (button.justUp) this.throwBomb();
	// }

	// handleSwordListener(button) {
	// 	if (button.justDown) this.throwSword();
	// }

	// handleRumListener(button) {
	// 	if (button.justDown) this.activateRum();
	// }

	chargeBomb() {
		if (this.bombGroup.getChildren().length === this.bombGroup.maxSize || this.isDead()) return
		this.bombBar.startCharging();
		const bomb = this.bombGroup.get();
		bomb.prepare(this);
		this.activeBomb = bomb;
	}

	throwBomb() {
		if (!this.bombBar.isVisible()) return
		if (this.activeBomb) this.activeBomb.throw(this.bombMaxVelocity * this.bombBar.stopCharging(), this);
		this.activeBomb = null;
	}

	throwSword() {
		if (this.inventoryData.sword === 0 || this.swordGroup.getChildren().length === this.swordGroup.maxSize || this.isDead()) return
		const sowrd = this.swordGroup.get();
		if (sowrd) sowrd.throw(this);
		this.inventoryData.sword--;
	}

	activateRum() {
		if (this.inventoryData.rum === 0 || this.isDead() || this.hasActiveRum) return
		this.hasActiveRum = true;
		this.setInvulnerability(true).setAlpha(0.5);
		this.inventoryData.rum--;
		this.activeItem = 0;
		this.scene.time.delayedCall(5000, () => this.disactivateRum());
	}

	disactivateRum() {
		this.hasActiveRum = false;
		this.setInvulnerability(false);
		this.scene.tweens.add({
			targets: this,
			duration: 500,
			ease: 'Sine.easeInOut',
			alpha: {
				getStart: () => 0.5,
				getEnd: () => 1
			},
			repeat: 0
		});
	}

	takeDamage() {
		if (this.isInvulnerable || this.isDead()) return
		if (this.health === 1) {
			this.setState('DEAD_HIT');
			this.setInvulnerability(true);
		} else {
			this.setState('HIT');
			this.setInvulnerability(true, true);
		}
		this.health--;
		return true
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