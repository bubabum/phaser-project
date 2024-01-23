import { Controller } from '../utility/Controller';
import { SoundManager } from '../utility/SoundManager';
import { RumPowerUp } from '../objects/RumPowerUp';
import { SwordPowerUp } from '../objects/SwordPowerUp';
import { Door } from '../objects/Door';
import { Gate } from '../objects/Gate';
import { MovingPlatform } from '../objects/MovingPlatform';
import { FadingPlatform } from '../objects/FadingPlatform';
import { Bottle } from '../projectiles/Bottle';
import { Bubble } from '../projectiles/Bubble';
import { CanonBall } from '../projectiles/CanonBall';
import { Seed } from '../projectiles/Seed';
import { Spike } from '../enemies/Spike';
import { MovingSpike } from '../enemies/MovingSpike';
import { FallingBarrel } from '../enemies/FallingBarrel';
import { Life } from '../objects/Life';
import { Continue } from '../objects/Continue';
import { Key } from '../objects/Key';
import { BombGuy } from '../player/BombGuy';
import { BaldPirate } from '../enemies/BaldPirate';
import { BigGuy } from '../enemies/BigGuy';
import { Canon } from '../enemies/Canon';
import { Capitan } from '../enemies/Capitan';
import { Cucumber } from '../enemies/Cucumber';
import { Boss } from '../enemies/Boss';
import { DecorationObject } from '../objects/DecorationObject';
import { Chain } from '../objects/Chain';
import { Candle } from '../objects/Candle';
import { Window } from '../objects/Window';

export class Game extends Phaser.Scene {

	static checkChance(chance) {
		return Math.floor(Math.random() * 99 + 1) >= chance
	}

	static getRandomFromArray(arr) {
		return Math.floor(Math.random() * arr.length)
	}

	static getRandom(min, max) {
		return Math.floor(Math.random() * (max - min) + min)
	}
	static checkGroupIntersection(groupArr, obj) {
		let result = false;
		groupArr.forEach(group => {
			group.getChildren().forEach(item => {
				if (Phaser.Geom.Intersects.RectangleToRectangle(obj.getBounds(), item.getBounds())) result = true;
			});
		})
		return result
	}

	constructor() {
		super({
			key: 'Game',
			physics: {
				arcade: {
					//debug: true,
					gravity: { y: 400 }
				},
			},
		})
		this.levels = [
			{ tilemapKey: 'first', hasLight: false },
			{ tilemapKey: 'second', hasLight: true },
			{ tilemapKey: 'three_isles', hasLight: false },
			{ tilemapKey: 'platformer', hasLight: true },
			{ tilemapKey: 'eight', hasLight: false },
			{ tilemapKey: 'six_rooms', hasLight: true },
			{ tilemapKey: 'boss', hasLight: true, hasBoss: true },
		];
	}

	init(props) {
		const {
			level = 0,
			playerData = {
				continue: 3,
				health: 3,
				inventory: {
					sword: 0,
					rum: 0,
				},
				collected: new Set(),
			},
			movingToNextLevel = true,
		} = props;
		this.currentLevel = level;
		this.hasLight = this.levels[this.currentLevel].hasLight;
		this.hasBoss = this.levels[this.currentLevel].hasBoss;
		this.playerData = playerData;
		this.movingToNextLevel = movingToNextLevel;
	}

	preload() {
	}

	create() {
		this.map = this.make.tilemap({ key: this.levels[this.currentLevel].tilemapKey, tileWidth: 64, tileHeight: 64 });
		this.tileset = this.map.addTilesetImage('tileset', 'tileset');
		this.groundLayer = this.map.createLayer('ground', this.tileset).setDepth(0);
		// const tileCollisionMap = {
		// 	1: [true, false, true, false, false],
		// 	2: [false, false, true, false, false],
		// 	3: [false, true, true, false, false],
		// 	7: [true, false, false, false, false],
		// 	8: [true, true, true, true, false],
		// 	9: [false, true, false, false, false],
		// 	13: [true, false, false, true, false],
		// 	14: [false, false, false, true, false],
		// 	15: [false, true, false, true, false],
		// 	56: [true, true, true, false, false],
		// }
		// this.groundLayer.forEachTile(tile => {
		// 	if (tileCollisionMap[tile.index]) tile.setCollision(...tileCollisionMap[tile.index])
		// })
		this.groundLayer.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26, 50, 56]);
		this.createDecorationTiles();
		this.platformsLayer = this.map.createLayer('platforms', this.tileset).setDepth(6);
		this.platformsLayer.filterTiles(tile => tile.index > 0).forEach(tile => tile.setCollision(false, false, true, false, false));
		this.hiddenPassageLayer = this.map.createLayer('hidden_passage', this.tileset);
		this.hiddenPassageLayer.setDepth(26);
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.controller = new Controller(this);
		this.createDoors();
		this.createMovingPlatforms();
		this.createFadingPlatforms();
		this.createTraps();
		this.createPlayer();
		this.createCollectibles();
		this.createEnemies();
		this.createDecorations();
		this.createLightObjects();
		this.createCamera();
		if (this.hasBoss) {
			this.createBoss();
			this.physics.add.overlap(this.boss, this.player.bombGroup, (boss, bomb) => {
				if (bomb.exploded) boss.takeDamage(false, bomb.damage);
			});
			this.physics.add.overlap(this.boss, this.player.swordGroup, (boss, sword) => {
				boss.takeDamage();
				sword.destroy();
			});
		}
		this.isWindows = window.navigator.userAgent.indexOf('Win') !== -1;
		if (this.hasLight && this.isWindows) this.createLight();

		this.physics.add.overlap(this.player.bombGroup, this.player, (player, bomb) => {
			if (bomb.exploded && player.takeDamage()) this.push(bomb, player);
		});
		this.physics.add.overlap(this.player.bombGroup, this.enemyGroup, (bomb, enemy) => {
			if (bomb.exploded && enemy.takeDamage(false, bomb.damage)) {
				this.push(bomb, enemy);
				if (enemy.health === 0) this.dropPowerUp(enemy);
			}
		});
		this.physics.add.overlap(this.player.swordGroup, this.enemyGroup, (sword, enemy) => {
			if (!enemy.isInvulnerable) {
				this.push(sword, enemy);
				enemy.takeDamage();
				if (this.cameras.main.worldView.contains(sword.x, sword.y)) sword.sounds.play('sword_embedded');
				sword.destroy();
				if (enemy.health === 0) this.dropPowerUp(enemy);
			}
		});
		this.physics.add.overlap(this.player.bombGroup, this.pushableDecorationGroup, (bomb, object) => {
			if (bomb.exploded) this.push(bomb, object);
		});

		// this.physics.add.overlap(this.player.bombGroup, this.player.bombGroup, (bomb1, bomb2) => {
		// 	if (bomb1.exploded) this.push(bomb1, bomb2, 500);
		// });

		// this.physics.world.on('worldstep', () => {
		// 	this.player.bombGroup.getChildren().forEach(item => item.setAngularVelocity(
		// 		Phaser.Math.RadToDeg(item.body.velocity.x / item.body.halfWidth)
		// 	));
		// });
		this.registry.set('playerData', this.player.getPlayerData(false));
		this.cameras.main.fadeIn(1000);

	}
	update(t, dt) {
		if (!this?.theme?.isPlaying) this.playRandomTheme()
		this.controller.update();
		this.movingXPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.movingYPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.fallenBarrelsGroup.getChildren().forEach(barrel => barrel.update());
		this.player.update({ t, dt, controller: this.controller });
		this.enemyGroup.getChildren().forEach(enemy => enemy.update());
		if (this.hasBoss) this.boss.update();
	}

	playRandomTheme() {
		if (this.theme) this.theme.stop();
		this.theme = this.sound.add(`theme${Game.getRandom(1, 7)}`);
		this.theme.setVolume(0.2).play();
	}

	dropPowerUp(enemy) {
		const { x, y } = enemy;
		let rnd = Math.floor(Math.random() * 9) + 1;
		let collectible;
		if (rnd === 1) {
			collectible = new RumPowerUp({ scene: this, x, y, textureKey: 'rum_drop' });
		} else if (1 < rnd && rnd < 7) {
			collectible = new SwordPowerUp({ scene: this, x, y, textureKey: 'sword_drop' });
		} else if (rnd === 7) {
			collectible = new Life({ scene: this, x, y, textureKey: 'life', type: 'life' });
		} else {
			return
		}
		this.collectibles.add(collectible);
		this.push(enemy, collectible)
	}

	changeLevel(door) {
		const keyDown = this.controller.buttons.openDoor.isPressed;
		const onFloor = this.player.body.onFloor();
		if (!keyDown || !onFloor) return
		const hasKey = this.player.collected.has(`${this.currentLevel}key`) && door.id === 1 || door.id === -1 && this.currentLevel !== 0;
		if (door.id === -1 && this.currentLevel === 0) return this.player.dialogue.show('Closed. It is first level, maybe you should go ahead.');
		if (door.id === 1 && this.currentLevel === this.levels.length - 1) return this.player.dialogue.show(`Well done! You beat all levels. Dummy programmer didn't create more...`);
		if (!hasKey) return this.player.dialogue.show('Closed. I need key!');
		door.disableBody();
		door.anims.play('opening');
		this.player.setState('DOOR_IN');
		door.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'opening', function (anims) {
			this.cameras.main.fadeOut(500);
			this.time.delayedCall(500, () => {
				this.scene.restart({ level: this.currentLevel + door.id, playerData: this.player.getPlayerData(false), movingToNextLevel: door.id === 1 });
			});
		}, this);
	}
	push(pusher, object, velocity = 200) {
		const point = {
			x: object.getCenter().x + (object.getCenter().x > pusher.getCenter().x ? -200 : 200),
			y: object.getCenter().y + 200,
		}
		const angle = Phaser.Math.Angle.BetweenPoints(point, object.getCenter());
		this.physics.velocityFromRotation(angle, velocity, object.body.velocity);
	}
	getObjectCoordinateX(obj) {
		return obj.x + obj.width * 0.5
	}

	getObjectCoordinateY(obj) {
		return obj.y - obj.height * 0.5
	}
	normalaizeCoordinateX(obj) {
		return Math.floor(obj.x / this.tileset.tileHeight) * this.tileset.tileHeight
	}
	normalaizeCoordinateY(obj) {
		return Math.floor(obj.y / this.tileset.tileHeight) * this.tileset.tileHeight - obj.height
	}

	createDecorationTiles() {
		const getRandomTexture = (texturKey, textureIndexes) => {
			return `${texturKey}${textureIndexes[Math.floor(Math.random() * textureIndexes.length)]}`;
		}
		const addRandomImage = (offsetX, offsetY, texturKey, textureIndexes, tile) => {
			this.add.image(tile.pixelX + offsetX, tile.pixelY + offsetY, getRandomTexture(texturKey, textureIndexes)).setOrigin(0, 0).setFlipX(false).setDepth(1);
		}
		const groundTilesMap = [
			{
				tiles: [2],
				position: [{ x: 19, y: 11 }, { x: -15, y: 27 }, { x: 19, y: 43 }],
				textureKey: 'decoration_tile',
				textureIndexes: [0, 0, 1, 2, 3],
			},
			{
				tiles: [14],
				position: [{ x: 19, y: 11 }, { x: -15, y: 27 }],
				textureKey: 'decoration_tile',
				textureIndexes: [0, 0, 1, 2, 3],
			},
			{
				tiles: [7],
				position: [{ x: 19, y: 11 }, { x: 19, y: 43 }],
				textureKey: 'decoration_tile',
				textureIndexes: [1, 3],
			},
			{
				tiles: [9],
				position: [{ x: -15, y: -5 }, { x: -15, y: 27 }, { x: -15, y: 59 }],
				textureKey: 'decoration_tile',
				textureIndexes: [3],
			},
			{
				tiles: [11],
				position: [{ x: 17, y: 8 }, { x: 47, y: 24 }, { x: 17, y: 40 }],
				textureKey: 'background_tile',
				textureIndexes: [0, 0, 0, 1, 2, 3],
			},
			{
				tiles: [4, 10, 16],
				position: [{ x: 17, y: 8 }, { x: 47, y: 24 }, { x: 17, y: 40 }],
				textureKey: 'background_tile',
				textureIndexes: [0, 1, 2, 3],
			},
			{
				tiles: [6, 18],
				position: [{ x: -17, y: 24 }],
				textureKey: 'background_tile',
				textureIndexes: [0, 1, 2, 3],
			},
			{
				tiles: [12],
				position: [{ x: -17, y: -8 }, { x: -17, y: 24 }, { x: -17, y: 56 }],
				textureKey: 'background_tile',
				textureIndexes: [0, 1, 2, 3],
			},
		]
		groundTilesMap.forEach(tileOptions => {
			this.groundLayer.filterTiles(tile => tileOptions.tiles.includes(tile.index)).forEach(tile => {
				tileOptions.position.forEach(position => {
					if (Game.checkChance(75)) addRandomImage(position.x, position.y, tileOptions.textureKey, tileOptions.textureIndexes, tile);
				})
			})
		})
	}
	createDoors() {
		this.doorGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false
		});
		this.map.getObjectLayer('doors').objects.forEach(object => {
			const id = object.properties.find(item => item.name === 'id').value;
			const door = new Door({ scene: this, x: this.getObjectCoordinateX(object), y: this.getObjectCoordinateY(object), textureKey: 'door', id });
			this.doorGroup.add(door);
		});
	}
	createMovingPlatforms() {
		this.movingXPlatformsGroup = this.physics.add.group({
			bounceX: 1,
			bounceY: 1,
			frictionX: 1,
			velocityX: 100,
			immovable: true,
			allowGravity: false,
		});
		this.movingYPlatformsGroup = this.physics.add.group({
			bounceX: 1,
			bounceY: 1,
			frictionY: 1,
			velocityY: 100,
			immovable: true,
			allowGravity: false,
		});
		const layer = this.map.getObjectLayer('moving_platforms')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const axis = object.properties.find(item => item.name === 'axis').value;
			const distance = object.properties.find(item => item.name === 'distance').value * this.tileset.tileWidth;;
			const movingPlatform = new MovingPlatform({
				scene: this,
				x: this.normalaizeCoordinateX(object),
				y: this.normalaizeCoordinateY(object),
				textureKey: 'platform',
				axis,
				distance,
			})
			if (axis === 'x') return this.movingXPlatformsGroup.add(movingPlatform);
			this.movingYPlatformsGroup.add(movingPlatform);
		});
	}
	createFadingPlatforms() {
		this.fadingPlatformsGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false,
		});
		const layer = this.map.getObjectLayer('fading_platforms')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const fadingPlatform = new FadingPlatform({
				scene: this,
				x: this.normalaizeCoordinateX(object),
				y: this.normalaizeCoordinateY(object),
				textureKey: 'platform',
			})
			this.fadingPlatformsGroup.add(fadingPlatform);
		});
	}
	createTraps() {
		const layer = this.map.getLayer('traps');
		if (!layer) return
		this.spikes = this.physics.add.group({
			allowGravity: false,
		});
		this.movingSpikes = this.physics.add.group({
			allowGravity: false,
		});
		this.fallenBarrelsGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.fallenBarrelCollidersGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.physics.add.collider(this.fallenBarrelsGroup, [this.groundLayer, this.platformsLayer]);
		layer.data.forEach(row => {
			row.forEach(tile => {
				if (tile.index === -1) return
				const x = tile.pixelX + tile.width * 0.5;
				const y = tile.pixelY + tile.height * 0.5;
				if ([41, 42, 47, 48].includes(tile.index)) {
					const spike = new Spike({
						scene: this,
						x,
						y,
						textureKey: 'spikes',
						type: tile.properties.type,
					})
					this.spikes.add(spike);
				}
				if ([53, 54, 59, 60].includes(tile.index)) {
					const rotation = tile.properties.rotation;
					const movingSpike = new MovingSpike({
						scene: this,
						x,
						y,
						textureKey: 'moving_spike',
						rotation,
					});
					this.movingSpikes.add(movingSpike);
				}
				if ([40].includes(tile.index)) {
					const fallingBarrel = new FallingBarrel({
						scene: this,
						x,
						y,
						textureKey: 'falling_barrel',
					});
					this.fallenBarrelsGroup.add(fallingBarrel);
					this.fallenBarrelCollidersGroup.add(fallingBarrel.checkCollider);
				}
			})
		})
	}
	createCollectibles() {
		const layer = this.map.getObjectLayer('collectibles')?.objects;
		if (!layer) return
		const { tileWidth, tileHeight } = this.tileset;
		const classes = {
			life: Life,
			continue: Continue,
			key: Key,
		}
		this.collectibles = this.physics.add.group({
			immovable: true,
			bounceX: 0.5,
			bounceY: 0.5,
			dragX: 1000,
			dragY: 100,
		});
		this.physics.add.overlap(this.player, this.collectibles, (player, collectible) => {
			if (player.addCollectible(collectible.id, collectible.type)) {
				player.sounds.play('power_up');
				collectible.disappear();
			}
		});
		this.physics.add.collider(this.collectibles, [this.groundLayer, this.platformsLayer]);
		layer.forEach(obj => {
			const type = obj.properties.find(item => item.name === 'type').value;
			const x = obj.x + tileWidth * 0.5;
			const y = obj.y - tileHeight + tileHeight * 0.5;
			const id = `${this.currentLevel}${x}${y}${type}`;
			if (this.player.collected.has(id) || this.player.collected.has(`${this.currentLevel}key`) && type === 'key') return
			const className = classes[type]
			const collectible = new className({
				scene: this,
				x,
				y,
				textureKey: type,
				type: type,
			})
			this.collectibles.add(collectible);
			if (type === 'key') collectible.body.setAllowGravity(false)
		})
	}
	createPlayer() {
		let door = this.doorGroup.getChildren().find(item => item.id === (this.movingToNextLevel ? -1 : 1));
		const textures = {
			player: 'bomb_guy',
			bombBar: 'bomb_bar',
			particles: {
				run: 'run_particles',
				jump: 'jump_particles',
				land: 'land_particles',
				rum: 'jump_particles',
			},
			inventory: {
				background: 'inventory',
				bomb: 'bomb_inventory',
				sword: 'sword_inventory',
				rum: 'rum_inventory',
			},
			continue: 'continue_inventory',
		}
		const soundMap = {
			'jump': 1,
			'walk': 1,
			'land': 1,
			'hit': 0.5,
			'throw': 1,
			'hit_bomb': 1,
			'power_up': 0.3,
			'death': 0.2,
			'rum': 0.2,
		}
		this.player = new BombGuy({ scene: this, x: door.x, y: door.y + door.height * 0.5, textures, playerData: this.playerData, soundMap });
		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer]);
		this.physics.add.collider(this.player, [this.movingXPlatformsGroup], (player, platform) => {
			if (player.body.onFloor()) player.setTouchingPlatform(platform, 'x');
		});
		this.physics.add.collider(this.player, [this.movingYPlatformsGroup], (player, platform) => {
			if (player.body.onFloor()) player.setTouchingPlatform(platform, 'y');
		});
		//this.physics.add.collider(this.player, this.movingYPlatformsGroup, (player, platform) => player.touchingPlatform = platform); // create player method
		this.physics.add.collider(this.player, this.fadingPlatformsGroup, (player, platform) => {
			if (player.body.onFloor()) {
				player.setTouchingPlatform(platform)
				platform.fade();
			}
		});
		this.physics.add.collider(this.player.bombGroup, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup], (bomb) => {
			if (Math.abs(bomb.body.velocity.x) < 10 && Math.abs(bomb.body.velocity.y) < 10 || Math.abs(bomb.body.velocity.y) < 5) return
			bomb.sounds.play('hit_bomb');
		});
		this.physics.add.collider(this.player.bombGroup, [this.movingYPlatformsGroup], (bomb, platform) => {
			if (Math.abs(Math.abs(bomb.body.velocity.y) - Math.abs(platform.body.velocity.y)) < 40) return
			bomb.sounds.play('hit_bomb');
		});
		this.physics.add.overlap(this.player, this.doorGroup, (player, door) => this.changeLevel(door));
		this.physics.add.overlap(this.player, this.fallenBarrelCollidersGroup, (player, collider) => collider.barrel.fall());
		this.physics.add.overlap(this.player.bombGroup, this.fallenBarrelCollidersGroup, (bomb, collider) => {
			if (bomb.exploded) collider.barrel.fall();
		});
		this.physics.add.overlap(this.player, [this.fallenBarrelsGroup, this.spikes, this.movingSpikes], (player, obj) => {
			if (player.takeDamage()) this.push(obj, player);
		});
		// this.physics.add.overlap(this.player, this.spikes, (player, spike) => {
		// 	if (player.takeDamage()) this.push(spike, player);
		// });
		this.physics.add.collider(this.player.swordGroup, [this.groundLayer], (sword) => sword.embed());
		door.anims.play('closing');
		//door.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'closing', () => this.sound.play('door_close'));
	}
	createCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 0);
		//this.cameras.main.setRoundPixels(true).setBackgroundColor(0xbababa);
	}
	createEnemies() {
		this.enemyGroup = this.physics.add.group();
		this.enemyHurtboxGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.canonBallGroup = this.physics.add.group({
			defaultKey: 'canon_ball',
			classType: CanonBall,
			allowGravity: false,
			angularVelocity: 1000,
		});
		this.bottleGroup = this.physics.add.group({
			defaultKey: 'blue_bottle_projectile',
			classType: Bottle,
			allowGravity: false,
			angularVelocity: 1000,
		});
		this.seeds = this.physics.add.group({
			defaultKey: 'seed',
			classType: Seed,
			allowGravity: false,
		});
		const classes = {
			'BaldPirate': BaldPirate,
			'Capitan': Capitan,
			'Canon': Canon,
			'Cucumber': Cucumber,
			'BigGuy': BigGuy,
		}
		const soundMap = {
			'enemy_atack': 0.5,
			'enemy_get_hit': 0.5,
			'enemy_death': 0.2,
			'enemy_teleport': 0.4,
		}
		this.enemySounds = new SoundManager(this, soundMap);
		if (!this.map.getObjectLayer('enemies')?.objects) return
		this.map.getObjectLayer('enemies').objects.forEach(object => {
			const className = classes[object.properties.find(item => item.name === 'className').value];
			const textureKey = object.properties.find(item => item.name === 'texture').value;
			let direction = 'right';
			if (object.flippedHorizontal) direction = 'left';
			const enemy = new className({
				scene: this,
				x: this.getObjectCoordinateX(object),
				y: this.getObjectCoordinateY(object),
				textureKey,
				direction,
			});
			this.enemyGroup.add(enemy);
			if (enemy.hurtbox) this.enemyHurtboxGroup.add(enemy.hurtbox);
		})
		this.physics.add.collider(this.enemyGroup, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup]);
		this.physics.add.collider(this.enemyGroup, this.movingYPlatformsGroup, (enemy, platform) => enemy.setTouchingPlatform(platform));
		this.physics.add.overlap(this.enemyGroup, [this.spikes, this.movingSpikes, this.fallenBarrelsGroup], (enemy, obj) => {
			if (enemy.takeDamage(true)) this.push(obj, enemy);
		});
		this.physics.add.overlap(this.player, this.enemyHurtboxGroup, (player, hurtbox) => {
			if (player.takeDamage()) this.push(hurtbox.enemy, player);
		});
		this.physics.add.collider([this.canonBallGroup, this.bottleGroup, this.seeds], [this.groundLayer], (projectile) => {
			this.lights.removeLight(projectile.light);
			projectile.destroy();
		});
		this.physics.add.overlap([this.canonBallGroup, this.bottleGroup, this.seeds], this.player, (player, projectile) => {
			if (!player.isInvulnerable) this.push(projectile, player);
			player.takeDamage();
		});
	}
	createBoss() {
		this.bubbles = this.physics.add.group({
			defaultKey: 'bubble',
			classType: Bubble,
			allowGravity: false,
			bounceX: 1,
			bounceY: 1,
		});
		this.gates = this.physics.add.group({
			allowGravity: false,
			immovable: true,
		});
		const layer = this.map.getObjectLayer('boss')?.objects;
		if (!layer) return
		layer.forEach(obj => {
			const type = obj.properties.find(item => item.name === 'type').value;
			switch (type) {
				case 'boss':
					this.boss = new Boss({
						scene: this,
						x: this.getObjectCoordinateX(obj),
						y: this.getObjectCoordinateY(obj),
						textureKey: 'whale',
						direction: 'right',
					});
					this.physics.add.collider(this.boss, [this.groundLayer, this.platformsLayer]);
					this.physics.add.collider(this.bubbles, [this.groundLayer, this.gates]);
					this.physics.add.overlap(this.bubbles, this.player, (player, projectile) => {
						if (player.takeDamage()) this.push(projectile, player);
					});
					this.physics.add.overlap(this.player, this.boss.hurtbox, (player, hurtbox) => {
						if (player.takeDamage()) this.push(hurtbox.enemy, player);
					});
					return
				case 'trigger':
					this.bossTrigger = this.add.circle(obj.x, obj.y, 10, 0x646464);
					this.bossTrigger.setVisible(false);
					this.physics.add.existing(this.bossTrigger);
					this.bossTrigger.body.setCircle(10);
					this.bossTrigger.body.setAllowGravity(false);
					this.physics.add.overlap(this.player, this.bossTrigger, () => {
						this.bossTrigger.body.setEnable(false);
						this.cameras.main.stopFollow();
						this.cameras.main.pan(this.cameraPoint.x, this.cameraPoint.y, 1500);
						this.enterGate.close();
						this.theme.stop();
						this.theme = this.sound.add(`theme8`);
						this.theme.setVolume(0.2).play();
						this.boss.turnToPlayer();
						this.time.delayedCall(2000, () => this.boss.dialogue.show('I will beat you!'));
						this.time.delayedCall(4000, () => {
							this.boss.enableBody();
							this.boss.setState('DISAPPEAR');
						});
					});
					return
				case 'camera_point':
					this.cameraPoint = { x: obj.x, y: obj.y }
					return
				case 'enter':
					const enterGate = new Gate({
						scene: this,
						x: this.getObjectCoordinateX(obj),
						y: this.getObjectCoordinateY(obj),
						textureKey: 'gate',
						status: 'OPENED',
					});
					this.gates.add(enterGate);
					this.enterGate = enterGate;
					return
				case 'exit':
					const exitGate = new Gate({
						scene: this,
						x: this.getObjectCoordinateX(obj),
						y: this.getObjectCoordinateY(obj),
						textureKey: 'gate',
						status: 'CLOSED',
					});
					this.gates.add(exitGate);
					this.exitGate = exitGate;
					return
			}
		})
		this.physics.add.collider(this.gates, [this.groundLayer, this.player]);
		this.physics.add.collider(this.player.swordGroup, [this.gates], (sword) => sword.embed());
		this.physics.add.collider(this.player.bombGroup, [this.gates]);
		this.physics.add.collider(this.player, [this.gates]);
	}
	createDecorations() {
		const textureKeys = ['barrel', 'blue_bottle', 'green_bottle', 'red_bottle', 'skull'];
		const chainTextures = ['small_chain', 'big_chain'];
		this.pushableDecorationGroup = this.physics.add.group({
			bounceX: 0.5,
			bounceY: 0.5,
			dragX: 100,
			dragY: 100,
		});
		const { tileWidth, tileHeight } = this.tileset;
		textureKeys.forEach(item => {
			this.groundLayer.filterTiles(tile => [1, 2, 3].includes(tile.index)).forEach(tile => {
				if (Game.checkChance(15) || Game.checkGroupIntersection([this.doorGroup, this.spikes, this.movingSpikes], tile)) return
				const { width, height } = this.textures.list[item].source[0];
				const obj = new DecorationObject({
					scene: this,
					x: tile.pixelX + Game.getRandom(width * 0.5, tileWidth - width * 0.5),
					y: tile.pixelY,
					textureKey: item,
					flipX: (Game.checkChance(50) ? true : false),
				});
				this.pushableDecorationGroup.add(obj);
			})
		})
		const tables = new Set();
		this.groundLayer.filterTiles(tile => tile.index === 2).forEach(tile => {
			if (this.groundLayer.getTileAt(tile.x - 1, tile.y)?.index !== 2) return
			if (this.groundLayer.getTileAt(tile.x + 1, tile.y)?.index !== 2) return
			for (let i = -2; i < 3; i++) {
				if (tables.has(`x${tile.x + i}y${tile.y}`)) return
			}
			if (Game.checkChance(10) || Game.checkGroupIntersection([this.doorGroup, this.spikes, this.movingSpikes], tile)) return
			const { width, height } = this.textures.list['table'].source[0];
			tables.add(`x${tile.x}y${tile.y}`)
			const table = new DecorationObject({
				scene: this,
				x: tile.pixelX + width * 0.5,
				y: tile.pixelY,
				textureKey: 'table',
			});
			const chairLeft = new DecorationObject({
				scene: this,
				x: tile.pixelX - tileWidth + width * 0.5,
				y: tile.pixelY,
				textureKey: 'chair',
			});
			const chairRight = new DecorationObject({
				scene: this,
				x: tile.pixelX + tileWidth + width * 0.5,
				y: tile.pixelY,
				textureKey: 'chair',
				flipX: true,
			});
			this.pushableDecorationGroup.addMultiple([table, chairLeft, chairRight]);
		});
		chainTextures.forEach(item => {
			this.groundLayer.filterTiles(tile => [13, 14, 15].includes(tile.index)).forEach(tile => {
				if (Game.checkChance(40)) return
				if ([1, 2, 3].includes(this.groundLayer.getTileAt(tile.x, tile.y + 2)?.index) && item === 'big_chain') return
				const { width, height } = this.textures.list[item].source[0];
				const obj = new Chain({
					scene: this,
					x: tile.pixelX + Game.getRandom(width * 0.5, tileWidth - width * 0.5),
					y: tile.pixelY + tileHeight,
					textureKey: item,
				});
			})
		});

		this.physics.add.collider(this.pushableDecorationGroup, [this.groundLayer, this.platformsLayer]);
	}

	createLightObjects() {
		const { tileWidth, tileHeight } = this.tileset;
		const lightObjects = [];
		this.groundLayer.filterTiles(tile => tile.index === 11).forEach(tile => {
			if (this.groundLayer.getTileAt(tile.x - 1, tile.y + 1)?.index !== 11) return
			for (let x = -4; x < 5; x++) {
				for (let y = -4; y < 5; y++) {
					if (lightObjects.includes(`${tile.x + x}${tile.y + y}`)) return
				}
			}
			lightObjects.push(`${tile.x}${tile.y}`)
			const obj = new (this.hasLight ? Candle : Window)({
				scene: this,
				x: tile.pixelX + tileWidth * 0.5,
				y: tile.pixelY + tileHeight * 0.5,
				textureKey: (this.hasLight ? 'candle' : 'window'),
			});
		});
	}

	createLight() {
		this.children.list.forEach(item => {
			if (!item.noLight) item.setPipeline('Light2D');
		})
		this.lights.enable().setAmbientColor(0x333333);
	}
}