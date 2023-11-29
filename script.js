class Game extends Phaser.Scene {

	static checkChance(chance) {
		return Math.floor(Math.random() * 99 + 1) <= chance
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
					debug: true,
					gravity: { y: 400 }
				},
			}
		})
		this.levels = [
			{ tilemapKey: 'level0', hasLight: false },
			{ tilemapKey: 'level1', hasLight: true },
			{ tilemapKey: 'level2', hasLight: false },
		];
	}

	init(props) {
		const {
			level = 0,
			playerData = {
				continue: 3,
				health: 3,
				inventory: {
					// bomb: 99,
					sword: 10,
					rum: 15,
				},
				collected: new Set(),
			},
			movingToNextLevel = true,
		} = props;
		this.currentLevel = level;
		this.hasLight = this.levels[this.currentLevel].hasLight;
		this.playerData = playerData;
		this.movingToNextLevel = movingToNextLevel;
	}

	preload() {

	}

	create() {
		this.map = this.make.tilemap({ key: this.levels[this.currentLevel].tilemapKey, tileWidth: 64, tileHeight: 64 });
		this.tileset = this.map.addTilesetImage('tileset', 'tiles');
		this.groundLayer = this.map.createLayer('ground', this.tileset);
		this.groundLayer.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26, 35, 36]);
		this.createDecorationTiles();
		this.platformsLayer = this.map.createLayer('platforms', this.tileset).setDepth(2);
		this.platformsLayer.filterTiles(tile => tile.index > 0).forEach(tile => tile.setCollision(false, false, true, false, false));
		this.hiddenPassageLayer = this.map.createLayer('hidden_passage', this.tileset);
		this.hiddenPassageLayer.setDepth(26);
		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

		this.controller = new Controller(this);

		// this.input.gamepad.once('connected', function (pad) {

		// 	this.gamepad = pad;
		// 	console.log(this.gamepad)
		// });

		this.createDoors();
		this.createMovingPlatforms();
		this.createFadingPlatforms();
		//this.createFallingBarrels();
		this.createTraps();
		this.createPlayer();
		this.createCollectibles();
		this.createPowerUps();
		this.createLives();
		this.createContinues();
		this.createKeys();
		this.createHealthBar();
		this.createEnemies();
		this.createDecorations();
		this.createLightObjects();
		this.createCamera();
		//this.showMessageBox('Use Left and Right to run, Up to jump, Down to open a door, and Space to throw a bomb!')

		if (this.hasLight) this.createLight();

		this.physics.add.overlap(this.player.bombGroup, this.player, (player, bomb) => {
			if (bomb.exploded && player.takeDamage()) this.push(bomb, player);
		});
		this.physics.add.overlap(this.player.bombGroup, this.enemyGroup, (bomb, enemy) => {
			if (!enemy.isInvulnerable && bomb.exploded) {
				this.push(bomb, enemy);
				enemy.takeDamage();
				if (enemy.health === 0) this.dropPowerUp(enemy);
			}
		});
		this.physics.add.overlap(this.player.swordGroup, this.enemyGroup, (sword, enemy) => {
			if (!enemy.isInvulnerable) {
				this.push(sword, enemy);
				enemy.takeDamage();
				sword.destroy();
				if (enemy.health === 0) this.dropPowerUp(enemy);
			}
		});
		this.physics.add.overlap(this.player.bombGroup, this.pushableDecorationGroup, (bomb, object) => {
			if (bomb.exploded) this.push(bomb, object);
		});

		// this.physics.world.on('worldstep', () => {
		// 	this.player.bombGroup.getChildren().forEach(item => item.setAngularVelocity(
		// 		Phaser.Math.RadToDeg(item.body.velocity.x / item.body.halfWidth)
		// 	));
		// });

		this.cameras.main.fadeIn(1000);
	}
	update(t, dt) {
		this.controller.update();
		this.movingXPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.movingYPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.fallenBarrelsGroup.getChildren().forEach(barrel => barrel.update());
		this.player.update({ controller: this.controller });
		this.healthBar.update();
		this.enemyGroup.getChildren().forEach(enemy => enemy.update());
		if (this.fpsCounter) this.fpsCounter.destroy();
		const { width } = this.cameras.main.worldView;
		const fps = Math.floor(this.sys.game.loop.actualFps);
		this.fpsCounter = this.add.bitmapText(width, 0, 'pixel', fps, 20, 1).setOrigin(1, 0).setScrollFactor(0, 0).setDepth(100);
	}

	showMessageBox(messageText) {
		if (this.messageBox) {
			this.messageBox.destroy();
			this.box.destroy();
			this.messageTimer.remove();
		}
		const { width, height } = this.cameras.main.worldView;
		this.messageBox = this.add.bitmapText(width / 2, height - 40, 'pixel', messageText, 20, 1).setMaxWidth(600).setOrigin(0.5, 1).setScrollFactor(0, 0).setDepth(31); //.setDropShadow(1, 1, '#323443');
		const bounds = this.messageBox.getTextBounds(true).global;
		this.box = this.add.rectangle(bounds.x - 20, bounds.y - 20, bounds.width + 40, bounds.height + 40, 0x323443, 0.9).setScrollFactor(0, 0).setDepth(30).setOrigin(0, 0); //323443
		this.messageTimer = this.time.delayedCall(3000, () => {
			this.messageBox.destroy();
			this.box.destroy();
		});
	}

	dropPowerUp(enemy) {
		const { x, y } = enemy;
		const rnd = Math.floor(Math.random() * 9) + 1;
		let powerUp;
		if (rnd === 1) {
			powerUp = new RumPowerUp({ scene: this, x, y, textureKey: 'rum' });
		} else if (1 < rnd && rnd < 6) {
			powerUp = new SwordPowerUp({ scene: this, x, y, textureKey: 'sword_powerup' });
		} else {
			return
		}
		this.powerUpGroup.add(powerUp);
		this.push(enemy, powerUp)
	}

	changeLevel(door) {
		// if (door.id !== this.scene.currentLevel &&
		// 	door.id !== -1 && Phaser.Input.Keyboard.JustDown(this.player.keyDown) &&
		// 	!this.player.hasKey &&
		// 	this.player.body.onFloor()) return this.showMessageBox('I need a key!')
		const keyDown = this.controller.buttons.openDoor.isPressed;
		const hasKey = this.player.collected.has(door.id - 1) || door.id < this.currentLevel && door.id !== -1;
		const onFloor = this.player.body.onFloor();
		if (!keyDown || !hasKey || !onFloor) return
		const movingToNextLevel = door.id > this.currentLevel;
		door.disableBody();
		door.anims.play('opening');
		this.player.setState('DOOR_IN');
		door.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'opening', function (anims) {
			this.cameras.main.fadeOut(500);
			this.time.delayedCall(500, () => {
				this.scene.restart({ level: door.id, playerData: this.player.getPlayerData(false), movingToNextLevel });
			});
		}, this);
	}
	push(pusher, object) {
		const point = {
			x: object.getCenter().x + (object.getCenter().x > pusher.getCenter().x ? -200 : 200),
			y: object.getCenter().y + 200,
		}
		const angle = Phaser.Math.Angle.BetweenPoints(point, object.getCenter());
		this.physics.velocityFromRotation(angle, 200, object.body.velocity);
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
		const chance = 25;
		function* checkChance(chance) {
			while (true) {
				yield Math.floor(Math.random() * 99 + 1) <= chance
			}
		}
		const getRandomTexture = (texturKey, textureIndexes) => {
			return `${texturKey}${textureIndexes[Math.floor(Math.random() * textureIndexes.length)]}`;
		}
		const addRandomImage = (offsetX, offsetY, texturKey, textureIndexes, tile) => {
			this.add.image(tile.pixelX + offsetX, tile.pixelY + offsetY, getRandomTexture(texturKey, textureIndexes)).setOrigin(0, 0).setFlipX(false);
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
					if (checkChance(chance).next().value) addRandomImage(position.x, position.y, tileOptions.textureKey, tileOptions.textureIndexes, tile);
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
	createPowerUps() {
		this.powerUpGroup = this.physics.add.group({
			immovable: true,
			bounceX: 0.5,
			bounceY: 0.5,
			dragX: 1000,
			dragY: 100,
		});
		this.physics.add.overlap(this.player, this.powerUpGroup, (player, poweUp) => {
			if (player.addPowerUp(poweUp.type)) poweUp.disappear()
		});

		this.physics.add.collider(this.powerUpGroup, [this.groundLayer, this.platformsLayer]);
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
	// createFallingBarrels() {
	// 	this.fallenBarrelsGroup = this.physics.add.group({
	// 		allowGravity: false,
	// 	});
	// 	this.fallenBarrelCollidersGroup = this.physics.add.group({
	// 		allowGravity: false,
	// 	});
	// 	const layer = this.map.getObjectLayer('falling_barrels')?.objects;
	// 	if (!layer) return
	// 	layer.forEach(object => {
	// 		const fallingBarrel = new FallingBarrel({
	// 			scene: this,
	// 			x: this.normalaizeCoordinateX(object),
	// 			y: this.normalaizeCoordinateY(object),
	// 			textureKey: 'falling_barrel',
	// 		})
	// 		this.fallenBarrelsGroup.add(fallingBarrel);
	// 		this.fallenBarrelCollidersGroup.add(fallingBarrel.checkCollider);
	// 	});
	// 	this.physics.add.collider(this.fallenBarrelsGroup, [this.groundLayer, this.platformsLayer]);
	// }
	createTraps() {
		const layer = this.map.getLayer('traps');
		if (!layer) return
		this.spikes = this.physics.add.group({
			allowGravity: false,
		});
		this.fallenBarrelsGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.fallenBarrelCollidersGroup = this.physics.add.group({
			allowGravity: false,
		});
		layer.data.forEach(row => {
			row.forEach(tile => {
				const x = tile.pixelX + tile.width * 0.5;
				const y = tile.pixelY + tile.height * 0.5;
				if ([41, 42, 47, 48].includes(tile.index)) {
					const spike = new Spike({
						scene: this,
						x,
						y,
						textureKey: 'spike',
						type: tile.properties.type,
					})
					this.spikes.add(spike);
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
		this.physics.add.collider(this.fallenBarrelsGroup, [this.groundLayer, this.platformsLayer]);
	}
	createCollectibles() {
		const layer = this.map.getLayer('collectibles');
		if (!layer) return
		const classes = {
			life: Life,
			continue: Continue,
			key: Key,
		}
		this.collectibles = this.physics.add.group({
			immovable: true,
		});
		this.physics.add.overlap(this.player, this.collectibles, (player, collectible) => {
			if (player.addCollectible(collectible.id, collectible.type)) collectible.disappear();
		});
		layer.data.forEach(row => {
			row.forEach(tile => {
				const x = tile.pixelX + tile.width * 0.5;
				const y = tile.pixelY + tile.height * 0.5;
				if (tile.index > 0) {
					const className = classes[tile.properties.type]
					const collectible = new className({
						scene: this,
						x,
						y,
						textureKey: tile.properties.type,
						type: tile.properties.type,
					})
					this.collectibles.add(collectible);
				}
				this.physics.add.collider(this.collectibles, [this.groundLayer, this.platformsLayer]);
			})
		})
	}
	createLives() {
		this.livesGroup = this.physics.add.group({
			immovable: true,
		});
		this.physics.add.collider(this.livesGroup, [this.groundLayer, this.platformsLayer]);
		this.physics.add.overlap(this.player, this.livesGroup, (player, life) => {
			if (player.addLife(life.id)) life.disappear();
		});
		const layer = this.map.getObjectLayer('lives')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const id = `${this.currentLevel}${object.x}${object.y}`;
			//if (this.player.collected.lives.has(id)) return
			const live = new Life({ scene: this, x: object.x, y: object.y, textureKey: 'life' });
			this.livesGroup.add(live);
		});
	}
	createContinues() {
		this.continues = this.physics.add.group({
			immovable: true,
		});
		this.physics.add.collider(this.continues, [this.groundLayer, this.platformsLayer]);
		this.physics.add.overlap(this.player, this.continues, (player, obj) => {
			if (player.addContinue(obj.id)) obj.disappear();
		});
		const layer = this.map.getObjectLayer('continues')?.objects;
		if (!layer) return
		layer.forEach((object) => {
			const id = `${this.currentLevel}${object.x}${object.y}`;
			//if (this.player.collected.continues.has(id)) return
			const newContinue = new Continue({ scene: this, x: object.x, y: object.y, textureKey: 'continue' });
			this.continues.add(newContinue);
		});
	}
	createKeys() {
		this.keysGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false,
		});
		this.keyOverlap = this.physics.add.overlap(this.player, this.keysGroup, (player, key) => {
			player.getKey(key.id);
			key.disappear();
		});
		const layer = this.map.getObjectLayer('keys')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const key = new Key({ scene: this, x: this.getObjectCoordinateX(object), y: this.getObjectCoordinateY(object), textureKey: 'key', id: this.currentLevel });
			this.keysGroup.add(key);
		});
	}
	createPlayer() {
		let door = this.doorGroup.getChildren().find(item => item.id === this.currentLevel - 1) || this.doorGroup.getChildren().sort((a, b) => a.id - b.id)[0];
		if (!this.movingToNextLevel) door = this.doorGroup.getChildren().find(item => item.id === this.currentLevel + 1);
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
		this.player = new Player({ scene: this, x: door.x, y: door.y + door.height * 0.5, textures, playerData: this.playerData });
		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup]);
		this.physics.add.collider(this.player, this.movingYPlatformsGroup, (player, platform) => player.touchingPlatform = platform); // create player method
		this.physics.add.collider(this.player, this.fadingPlatformsGroup, (player, platform) => {
			if (player.body.onFloor()) platform.fade();
		});
		this.physics.add.collider(this.player.bombGroup, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup, this.movingYPlatformsGroup]);
		this.physics.add.overlap(this.player, this.doorGroup, (player, door) => this.changeLevel(door));
		this.physics.add.overlap(this.player, this.fallenBarrelCollidersGroup, (player, collider) => collider.barrel.fall());
		this.physics.add.overlap(this.player, this.fallenBarrelsGroup, (player, barrel) => {
			if (player.takeDamage()) this.push(barrel, player);
		});
		this.physics.add.overlap(this.player, this.spikes, (player, spike) => {
			if (player.takeDamage()) this.push(spike, player);
		});
		this.physics.add.collider(this.player.swordGroup, this.groundLayer, (sword) => sword.destroy());
		door.anims.play('closing');
	}
	createCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels).setRoundPixels(true);
		this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);
		this.cameras.main.setRoundPixels(true).setBackgroundColor(0xbababa);
	}
	createHealthBar() {
		const textures = {
			healthBar: 'health_bar',
			life: 'life_inventory',
		}
		this.healthBar = new HealthBar({ scene: this, player: this.player, textures });
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
			defaultKey: 'blue_bottle',
			classType: Bottle,
			allowGravity: false,
			angularVelocity: 1000,
		});
		const classes = {
			'BaldPirate': BaldPirate,
			'Capitan': Capitan,
			'Canon': Canon,
			'Cucumber': Cucumber,
			'BigGuy': BigGuy,
		}
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
		this.physics.add.overlap(this.player, this.enemyHurtboxGroup, (player, hurtbox) => {
			if (hurtbox.enemy.canHit) {
				player.takeDamage();
				hurtbox.enemy.completeAtack();
				this.push(hurtbox.enemy, player);
			}
		});
		this.physics.add.collider([this.canonBallGroup, this.bottleGroup], [this.groundLayer], (projectile) => {
			this.lights.removeLight(projectile.light);
			projectile.destroy();
		});
		this.physics.add.overlap([this.canonBallGroup, this.bottleGroup], this.player, (player, projectile) => {
			if (!player.isInvulnerable) this.push(projectile, player);
			player.takeDamage();
		});
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
				if (Game.checkChance(85) || Game.checkGroupIntersection([this.doorGroup, this.spikes], tile)) return
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
		this.groundLayer.filterTiles(tile => tile.index === 2).forEach(tile => {
			if (this.groundLayer.getTileAt(tile.x - 1, tile.y)?.index !== 2) return
			if (this.groundLayer.getTileAt(tile.x + 1, tile.y)?.index !== 2) return
			if (Game.checkChance(90) || Game.checkGroupIntersection([this.doorGroup, this.spikes], tile)) return
			const { width, height } = this.textures.list['table'].source[0];
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
				if (Game.checkChance(90)) return
				const { width, height } = this.textures.list[item].source[0];
				const obj = new Chain({
					scene: this,
					x: tile.pixelX + Game.getRandom(width * 0.5, tileWidth - width * 0.5),
					y: tile.pixelY + tileHeight,
					textureKey: item,
				});
			})
		});

		this.physics.add.collider(this.pushableDecorationGroup, [this.groundLayer, this.platformsLayer, this.pushableDecorationGroup]);
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
			if (!item.lifeTexture) item.setPipeline('Light2D');
		})
		this.lights.enable().setAmbientColor(0x333333);
	}
}

function getKeyFrames(array) { //utility for production
	let start = 0;
	let end = -1;
	let result = [];
	array.forEach(item => {
		end += item;
		result.push([start, end])
		start = end + 1;
	})
	return result
}

//console.log(getKeyFrames([38, 16, 1, 4, 2, 3, 11, 8, 1, 16, 11, 8, 6, 4]))