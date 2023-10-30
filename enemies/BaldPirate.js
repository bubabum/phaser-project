class BaldPirate extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.canInteractWithBomb = true;
		this.health = 2;
		this.speedX = 170;
		//this.visionRange = 200;
		this.atackRange = 40;
		this.hurtboxRadius = 20;
		this.hurtboxOffsetY = 10;
		this.bodyProperties = { width: 30, height: 60, offsetX: 17, offsetY: 5, flipOffsetX: 17 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.setBodyProperties(direction);
		this.createHurtbox();
		this.createAnimations(textureKey);
		this.states = [
			new BaldPirateIdle(this),
			new BaldPirateRun(this),
			new BaldPirateHitBomb(this),
			new BaldPirateMoveToPlayer(this),
			new BaldPirateClimbUp(this),
			new BaldPirateLongJumpUp(this),
			new BaldPirateJumpUp(this),
			new BaldPirateLongJumpDown(this),
			new BaldPirateJumpDown(this),
			new EnemyAtack(this),
			new EnemyAirAtack(this),
			new EnemyMoveToBomb(this),
			new EnemyJump(this),
			new EnemyFall(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
		];
		this.setState('IDLE');
	}

	interactWithBomb(bomb) {
		this.setState('HIT_BOMB');
		if (this.anims.currentFrame.index > 4) bomb.setVelocity((this.direction === 'right' ? 250 : -250), -250);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 33 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 34, end: 47 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'dash',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 34, end: 47 }),
			frameRate: 40,
			repeat: -1,
		});
		this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 49, end: 52 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'fall',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 53, end: 54 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'land',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 55, end: 57 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 69 }),
			frameRate: 40,
			repeat: 0,
		});
		this.anims.create({
			key: 'air_atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 69 }),
			frameRate: 40,
			repeat: 0,
		});
		this.anims.create({
			key: 'hit_bomb',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 69 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 70, end: 77 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 78, end: 83 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 84, end: 87 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}