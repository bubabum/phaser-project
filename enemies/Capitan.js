class Capitan extends Enemy {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		this.setSize(30, 67);
		this.setOffset(20, 5);
		this.createAnimations(textureKey);
		this.states = [
			new EnemyIdle(this),
			new EnemyRunning(this),
			new EnemyFalling(this),
			new EnemyAtack(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
		];
		this.setState('IDLE');
		this.velocityX = 120;
		this.health = 2;
		this.createAtackHitbox();
		this.properties = {
			canDash: true,
			health: 2,
			speedX: 120,
			dashSpeedX: 180,
			visionRange: 200,
			atackRange: 50,
			direction: 'right',
			isInvulnerable: false,
		}
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
			key: 'IDLE',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 31 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'RUNNING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 32, end: 45 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'FALLING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 51, end: 52 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'ATACK',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'HIT',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 75, end: 82 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'DEAD_HIT',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 83, end: 88 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}