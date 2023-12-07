import { Character } from '../utility/Character';
import { BombBar } from './BombBar';
import { Bomb } from './Bomb';
import { Sword } from './Sword';
import { ParticlesGroup } from '../utility/Particles';
import { Idle } from './PlayerState';
import { Run } from './PlayerState';
import { Jump } from './PlayerState';
import { Fall } from './PlayerState';
import { Land } from './PlayerState';
import { Hit } from './PlayerState';
import { DeadHit } from './PlayerState';
import { DeadGround } from './PlayerState';
import { DoorIn } from './PlayerState';
import { DoorOut } from './PlayerState';


export class BombGuy extends Character {

	constructor({ scene, x, y, textures, playerData }) {
		super({ scene, x, y: y - 25, texture: textures.player });
		this.setDepth(23);
		this.setSize(25, 50);
		this.setOffset(20, 8);
		this.setDepth(23);
		this.setGravityY(400);
		this.setMass(1);
		this.setFriction(1, 1);
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
		this.bombGroup = scene.physics.add.group({
			defaultKey: 'bomb',
			classType: Bomb,
			maxSize: 3,
			bounceX: 0.7,
			bounceY: 0.7,
			dragX: 50,
			dragY: 50,
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
		this.light = this.scene.add.pointlight(400, 300, 0xaaaaaa, 100, 0.2, 0.05).setDepth(36);

	}

	update({ t, dt, controller }) {
		//console.log(this.currentState.name)
		//console.log(this.touchingPlatform)
		//console.log(this.body.onFloor())
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

		currentState.handleInput({ dt, controller });
	}

	isPlayer() {
		return true
	}

	getPlayerData(death = true) {
		return {
			continue: this.continue,
			health: death ? this.maxHeath : this.health,
			inventory: this.inventoryData,
			collected: this.collected,
		}
	}

	addCollectible(id, type) {
		if (this.isDead()) return
		switch (type) {
			case 'life':
				if (this.health === this.maxHeath) return false
				this.health++
				this.collected.add(id);
				this.scene.registry.set('playerData', this.getPlayerData(false));
				return true
			case 'continue':
				this.continue++
				this.collected.add(id);
				this.scene.registry.set('playerData', this.getPlayerData(false));
				return true
			case 'key':
				this.collected.add(id);
				this.scene.registry.set('playerData', this.getPlayerData(false));
				return true
			case 'rum':
			case 'sword':
				if (this.inventoryData[type] === 9) return false
				this.inventoryData[type]++;
				this.scene.registry.set('playerData', this.getPlayerData(false));
				return true
		}
		return false
	}

	chargeBomb() {
		if (this.bombGroup.getChildren().length === this.bombGroup.maxSize || this.isDead()) return
		this.bombBar.startCharging();
		const bomb = this.bombGroup.get();
		bomb.prepare(this);
		this.activeBomb = bomb;
	}

	throwBomb() {
		//if (!this.bombBar.isVisible()) return
		if (this.activeBomb) this.activeBomb.throw(this.bombMaxVelocity * this.bombBar.stopCharging(), this);
		this.activeBomb = null;
	}

	throwSword() {
		if (this.inventoryData.sword === 0 || this.swordGroup.getChildren().length === this.swordGroup.maxSize || this.isDead()) return
		const sowrd = this.swordGroup.get();
		if (sowrd) sowrd.throw(this);
		this.inventoryData.sword--;
		this.scene.registry.set('playerData', this.getPlayerData(false));
	}

	activateRum() {
		if (this.inventoryData.rum === 0 || this.isDead() || this.hasActiveRum) return
		this.hasActiveRum = true;
		this.setInvulnerability(true).setAlpha(0.5);
		this.inventoryData.rum--;
		this.scene.registry.set('playerData', this.getPlayerData(false));
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