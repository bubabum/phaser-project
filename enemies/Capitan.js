class Capitan extends Enemy {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		this.setSize(30, 67);
		this.setOffset(20, 5);
		this.createAnimations(textureKey);
		this.states = [
			new EnemyIdle(this),
			new EnemyRun(this),
			new EnemyFall(this),
			new EnemyAtack(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
			new EnemyScaryRun(this),
		];
		this.setState('IDLE');
		this.canRun = true;
		this.canDash = true;
		this.canJump = true;
		this.canScaryRun = false;
		this.canHitBomb = true;
		this.health = 2;
		this.speedX = 120;
		this.dashSpeedX = 250;
		this.scaryRunSpeed = 200;
		this.visionRange = 200;
		this.atackRange = 40;
		this.scaryRunRange = 60;
		this.direction = 'right';
		this.atackHitboxRadius = 20;
		this.atackHitboxOffsetY = 10;
		this.isInvulnerable = false;
		this.createAtackHitbox();
	}

	checkScaryRun() {
		if (bombs.getChildren().length === 0) return
		for (let i = 0; i < bombs.getChildren().length; i++) {
			if (Phaser.Math.Distance.BetweenPoints(bombs.getChildren()[i], this) < this.properties.scaryRunRange) return true
		}
		return false
	}

	makeScaryRun() {
		let bomb = bombs.getChildren().sort((a, b) => Math.abs(a.x - this.x) - Math.abs(b.x - this.x))[0];
		if (bomb.x < this.x) return this.setDirection('right', this.properties.scaryRunSpeed)
		this.setDirection('left', this.properties.scaryRunSpeed);
	}

	createAtackHitbox() {
		this.atackHitbox = this.scene.add.circle(this.x, this.y, 30, 0x918f8d);
		this.atackHitbox = this.scene.physics.add.existing(this.atackHitbox);
		this.atackHitbox.body.setCircle(30);
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
			key: 'fall',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 51, end: 52 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
			frameRate: 20,
			repeat: -1,
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
	}

}