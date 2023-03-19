class Cucumber extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		//this.canScaryRun = false;
		//this.canHitBomb = true;
		//this.canShoot = false;
		this.health = 2;
		this.speedX = 100;
		this.dashSpeedX = 180;
		this.moveToBombSpeedX = 180;
		this.visionRange = 200;
		this.atackRange = 40;
		this.hurtboxRadius = 15;
		this.hurtboxOffsetY = -10;
		this.bodyProperties = { width: 27, height: 60, offsetX: 19, offsetY: 5, flipOffsetX: 17 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.setBodyProperties(direction);
		this.createHurtbox();
		this.createAnimations(textureKey);
		this.states = [
			new EnemyIdle(this),
			new EnemyRun(this),
			new EnemyDash(this),
			new EnemyJump(this),
			new EnemyJumpUp(this),
			new EnemyJumpDown(this),
			new EnemyFall(this),
			new EnemyAtack(this),
			new EnemyAirAtack(this),
			new EnemyMoveToBomb(this),
			//new EnemyHitBomb(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
		];
		this.setState('IDLE');
	}

	hitBomb(bomb) {
		this.setState('HIT_BOMB');
		if (this.anims.currentFrame.index > 4) bomb.setVelocity((this.direction === 'right' ? 250 : -250), -250);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 35 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 36, end: 47 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'dash',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 36, end: 47 }),
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
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 68 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'air_atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 58, end: 68 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'blow_the_wick',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 69, end: 79 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 80, end: 87 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 88, end: 93 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 94, end: 97 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}