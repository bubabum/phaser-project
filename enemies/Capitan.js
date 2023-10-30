class Capitan extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.bottleGroup = scene.bottleGroup;
		this.maxHealth = 2;
		this.health = this.maxHealth;
		this.speedX = 120;
		this.throwRange = 270;
		this.atackRange = 40;
		this.hurtboxRadius = 25;
		this.hurtboxOffsetY = 0;
		this.bodyProperties = { width: 30, height: 67, offsetX: 20, offsetY: 5, flipOffsetX: 30 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.canThrow = true;
		this.setBodyProperties(direction);
		this.createHurtbox();
		this.createAnimations(textureKey);
		this.states = [
			new CapitanIdle(this),
			new CapitanRun(this),
			new CapitanThrowBottle(this),
			new EnemyAtack(this),
			new EnemyFall(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
		];
		this.setState('IDLE');
	}

	checkThrowRange() {
		return Phaser.Math.Distance.BetweenPoints(this.player, this) < this.throwRange
	}

	throwBottle() {
		if (this.anims.currentFrame.index === 5 && this.canThrow && ['THROW_BOTTLE'].includes(this.currentState.name)) {
			this.canThrow = false;
			const bottle = this.bottleGroup.get();
			bottle.setPosition(this.x, this.y);
			const angle = Phaser.Math.Angle.BetweenPoints(this, this.player);
			this.scene.physics.velocityFromRotation(angle, 300, bottle.body.velocity);
			this.scene.time.delayedCall(3000, () => this.canThrow = true);
			this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'air_atack', function (anims) {
				this.setState('IDLE')
			}, this);
		}
	}

	checkScaryRun() {
		if (this.bombGroup.getChildren().length === 0) return
		for (let i = 0; i < this.bombGroup.getChildren().length; i++) {
			if (Phaser.Math.Distance.BetweenPoints(this.bombGroup.getChildren()[i], this) < this.scaryRunRange) return true
		}
		return false
	}

	makeScaryRun() {
		const bomb = this.bombGroup.getChildren().sort((a, b) => Math.abs(a.x - this.x) - Math.abs(b.x - this.x))[0];
		if (bomb.x < this.x) return this.setDirection('right')
		this.setDirection('left');
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 31 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 32, end: 45 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'dash',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 32, end: 45 }),
			frameRate: 40,
			repeat: -1,
		});
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 47, end: 50 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'fall',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 51, end: 52 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'air_atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'scary_run',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 63, end: 74 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 75, end: 82 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 83, end: 88 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 89, end: 92 }),
			frameRate: 20,
			repeat: -1,
		});
	}

}