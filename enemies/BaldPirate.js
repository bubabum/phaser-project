class BaldPirate extends Enemy {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		this.setSize(30, 60);
		this.setOffset(20, 5);
		this.createAnimations(textureKey);
		this.states = [
			new EnemyIdle(this),
			new EnemyRun(this),
			new EnemyDash(this),
			new EnemyJump(this),
			new EnemyFall(this),
			new EnemyAtack(this),
			new EnemyAirAtack(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
		];
		this.setState('IDLE');
		this.createAtackHitbox();
		this.properties = {
			canRun: true,
			canDash: true,
			canScaryRun: false,
			health: 2,
			speedX: 120,
			dashSpeedX: 250,
			scaryRunSpeed: 200,
			visionRange: 200,
			atackRange: 30,
			scaryRunRange: 60,
			direction: 'right',
			isInvulnerable: false,
		}
	}

	createAtackHitbox() {
		this.atackHitbox = this.scene.add.circle(this.x, this.y, 30, 0x918f8d);
		this.atackHitbox = this.scene.physics.add.existing(this.atackHitbox);
		this.atackHitbox.body.setCircle(25);
		this.atackHitbox.body.setOffset(0, 20);
		this.atackHitbox.body.setAllowGravity(false);
		this.atackHitbox.setVisible(false);
		let playerCollider = this.scene.physics.add.overlap(this.atackHitbox, player, () => {
			if (this.anims.currentFrame.index === 5 && !this.isAtacking && this.currentState.name === 'ATACK') {
				player.health--;
				if (player.health === 0) player.scene.scene.restart();
				console.log('hit')
				this.isAtacking = true;
			}
			if (this.anims.currentFrame.index !== 5) this.isAtacking = false;
			// player.setState('HIT');
			// const angle = Phaser.Math.Angle.BetweenPoints(this.getCenter(), player.getCenter());
			// this.atackHitbox.body.enable = false;
			// this.scene.physics.velocityFromRotation(angle, 200, player.body.velocity);
			// this.scene.physics.world.removeCollider(playerCollider);
		});
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
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'air_atack',
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