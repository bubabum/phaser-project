import { BossIdle } from './BossState';
import { BossMove } from './BossState';
import { BossThrowBubble } from './BossState';
import { EnemyHit } from './EnemyState';
import { EnemyDeadHit } from './EnemyState';
import { EnemyDeadGround } from './EnemyState';
import { Enemy } from './Enemy';

export class Boss extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.bubbles = scene.bubbles;
		this.maxHealth = 10;
		this.health = this.maxHealth;
		//this.speedX = 120;
		this.startX = x;
		this.startY = y;
		this.position = 0;
		this.movePositions = [
			[0, 0],
			[-5, 0],
			[-7, 1],
			[-7, -1],
			[2, 1],
			[2, -1],
		],
			// this.throwRange = 270;
			// this.atackRange = 40;
			// this.hurtboxRadius = 25;
			// this.hurtboxOffsetY = 0;
			this.bodyProperties = { width: 64, height: 40, offsetX: 3, offsetY: 6, flipOffsetX: 1 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.canThrow = true;
		this.setBodyProperties(direction);
		//this.createHurtbox();
		this.createAnimations(textureKey);
		this.states = [
			new BossIdle(this),
			new BossMove(this),
			new BossThrowBubble(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
			new EnemyDeadGround(this),
		];
		this.setState('IDLE');
	}

	changePosition() {
		const { tileWidth, tileHeight } = this.scene.tileset;
		let rnd = Math.floor(Math.random() * (this.movePositions.length - 1));
		console.log(this.movePositions[rnd])
		const x = this.startX + this.movePositions[rnd][0] * tileWidth;
		const y = this.startY + this.movePositions[rnd][1] * tileHeight;
		this.setPosition(x, y);
	}

	throwBubble() {
		if (this.anims.currentFrame.index === 5 && this.canThrow) {
			this.canThrow = false;
			const bubble = this.bubbles.get();
			bubble.setPosition(this.x, this.y);
			const angle = Phaser.Math.Angle.BetweenPoints(this, this.player);
			this.scene.physics.velocityFromRotation(angle, 250, bubble.body.velocity);
			this.scene.time.delayedCall(3000, () => this.canThrow = true);
			this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'throw_bubble', function (anims) {
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
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 43 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 44, end: 57 }),
			frameRate: 20,
			repeat: -1,
		});
		// this.anims.create({
		// 	key: 'dash',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 32, end: 45 }),
		// 	frameRate: 40,
		// 	repeat: -1,
		// });
		// this.anims.create({
		// 	key: 'jump',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 47, end: 50 }),
		// 	frameRate: 20,
		// 	repeat: 0,
		// });
		// this.anims.create({
		// 	key: 'fall',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 51, end: 52 }),
		// 	frameRate: 20,
		// 	repeat: 0,
		// });
		this.anims.create({
			key: 'atack',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 79, end: 88 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'throw_bubble',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 79, end: 88 }),
			frameRate: 20,
			repeat: 0,
		});
		// this.anims.create({
		// 	key: 'air_atack',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 56, end: 62 }),
		// 	frameRate: 20,
		// 	repeat: 0,
		// });
		// this.anims.create({
		// 	key: 'scary_run',
		// 	frames: this.anims.generateFrameNumbers(textureKey, { start: 63, end: 74 }),
		// 	frameRate: 20,
		// 	repeat: -1,
		// });
		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 89, end: 95 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_hit',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 96, end: 101 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 102, end: 105 }),
			frameRate: 10,
			repeat: -1,
		});
	}

}