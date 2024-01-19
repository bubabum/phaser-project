import { BossWaiting } from './BossState';
import { BossIdle } from './BossState';
import { BossDisappear } from './BossState';
import { BossAppear } from './BossState';
import { BossThrowBubble } from './BossState';
import { BossAtack } from './BossState';
import { BossHit } from './BossState';
import { BossDeadHit } from './BossState';
import { BossDeadGround } from './BossState';
import { Enemy } from './Enemy';
import { Dialogue } from '../utility/Dialogue';

export class Boss extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.bubbles = scene.bubbles;
		this.maxHealth = 5;
		this.health = this.maxHealth;
		this.atackRange = 40;
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
		];
		this.hurtboxRadius = 20;
		this.hurtboxOffsetY = 0;
		this.bodyProperties = { width: 64, height: 40, offsetX: 3, offsetY: 6, flipOffsetX: 1 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.canThrow = true;
		this.bubbleTimer = null;
		this.setBodyProperties(direction);
		this.createHurtbox();
		this.dialogue = new Dialogue(scene, this);
		this.createAnimations(textureKey);
		this.states = [
			new BossWaiting(this),
			new BossIdle(this),
			new BossDisappear(this),
			new BossAppear(this),
			new BossThrowBubble(this),
			new BossAtack(this),
			new BossHit(this),
			new BossDeadHit(this),
			new BossDeadGround(this),
		];
		this.setState('WAITING');
	}

	isBoss() {
		return true
	}

	changePosition() {
		const { tileWidth, tileHeight } = this.scene.tileset;
		let rnd;
		do {
			rnd = Math.floor(Math.random() * (this.movePositions.length - 1));
		} while (rnd === this.position);
		this.position = rnd;
		const x = this.startX + this.movePositions[rnd][0] * tileWidth;
		const y = this.startY + this.movePositions[rnd][1] * tileHeight;
		this.setPosition(x, y);
	}

	throwBubble() {
		if (!this.canThrow) return
		this.canThrow = false;
		const bubble = this.bubbles.get();
		bubble.setPosition(this.x, this.y);
		const angle = Phaser.Math.Angle.BetweenPoints(this, this.player);
		this.scene.physics.velocityFromRotation(angle, 250, bubble.body.velocity);
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
			frames: this.anims.generateFrameNumbers(textureKey, { start: 68, end: 78 }),
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
			repeat: -1,
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
		this.anims.create({
			key: 'disappear',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 106, end: 115 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'appear',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 115, end: 106 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}