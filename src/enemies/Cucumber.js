import { CucumberIdle } from './CucumberState';
import { CucumberRun } from './CucumberState';
import { CucumberDash } from './CucumberState';
import { CucumberShoot } from './CucumberState';
import { CucumberBlowTheWick } from './CucumberState';
import { EnemyAtack } from './EnemyState';
import { EnemyMoveToBomb } from './EnemyState';
import { EnemyFall } from './EnemyState';
import { EnemyHit } from './EnemyState';
import { EnemyDeadHit } from './EnemyState';
import { EnemyDeadGround } from './EnemyState';
import { Enemy } from './Enemy';

export class Cucumber extends Enemy {

	constructor({ scene, x, y, textureKey, direction }) {
		super({ scene, x, y, textureKey });
		this.seeds = scene.seeds;
		this.canInteractWithBomb = true;
		this.maxHealth = 1;
		this.health = this.maxHealth;
		this.speedX = 120;
		this.dashSpeedX = 250;
		this.throwRange = 270;
		//this.moveToBombSpeedX = 180;
		this.visionRange = 200;
		this.atackRange = 20;
		this.hurtboxRadius = 20;
		this.hurtboxOffsetY = 0;
		this.bodyProperties = { width: 27, height: 63, offsetX: 19, offsetY: 5, flipOffsetX: 17 };
		this.isInvulnerable = false;
		this.isAtacking = false;
		this.useBlowTheWick = true;
		this.canShoot = true;
		this.setBodyProperties(direction);
		this.createHurtbox();
		this.createAnimations(textureKey);
		this.states = [
			new CucumberIdle(this),
			new CucumberRun(this),
			new CucumberDash(this),
			new CucumberShoot(this),
			new CucumberBlowTheWick(this),
			new EnemyAtack(this),
			new EnemyMoveToBomb(this),
			new EnemyFall(this),
			new EnemyHit(this),
			new EnemyDeadHit(this),
			new EnemyDeadGround(this),
		];
		this.setState('IDLE');
	}

	interactWithBomb() {
		if (!this.bombToInteract || this?.bombToInteract.exploded) return
		this.bombToInteract.turnOff();
		this.bombToInteract = null;
	}

	shootSeed() {
		this.canShoot = false;
		const seed = this.seeds.get();
		seed.fly(this.x, this.y, this.direction)
		this.scene.time.delayedCall(3000, () => this.canShoot = true);
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
			frameRate: 40,
			repeat: 0,
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
			frameRate: 10,
			repeat: -1,
		});
	}

}