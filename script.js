class MainScene extends Phaser.Scene {
	//currentLevel

	constructor() {
		super({ key: 'MainScene' })
		this.levels = [
			{ tilemapKey: 'map', hasLight: false },
			{ tilemapKey: 'map2', hasLight: true },
		];
	}

	init(props) {
		const {
			level = 0,
			playerData = {
				continue: 3,
				health: 3,
				inventory: {
					bomb: 99,
					sword: 10,
					rum: 15,
				}
			},
		} = props
		this.currentLevel = level;
		this.playerData = playerData;
	}

	preload() {
		this.load.image('tiles', './assets/tileset.png');
		this.load.tilemapTiledJSON('map', './assets/demo_level.json');
		this.load.tilemapTiledJSON('map2', './assets/demo_level2.json');

		this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
		this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
		this.load.image('sword', 'assets/sword.png');
		this.load.image('bomb_inventory', 'assets/bomb_inventory.png');
		this.load.image('sword_inventory', 'assets/sword_inventory.png');
		this.load.image('rum_inventory', 'assets/rum_inventory.png');
		this.load.spritesheet('bomb_bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
		this.load.image('health_bar', 'assets/health_bar.png');
		this.load.image('life', 'assets/life.png');
		this.load.image('enemy_health_bar', 'assets/enemy_health_bar.png');
		this.load.image('health', 'assets/health.png');

		this.load.spritesheet('run_particles', 'assets/run_particles.png', { frameWidth: 12, frameHeight: 10 });
		this.load.spritesheet('jump_particles', 'assets/jump_particles.png', { frameWidth: 40, frameHeight: 28 });
		this.load.spritesheet('land_particles', 'assets/land_particles.png', { frameWidth: 80, frameHeight: 10 });
		this.load.spritesheet('life_idle', 'assets/life_idle.png', { frameWidth: 20, frameHeight: 18 });
		this.load.spritesheet('key', 'assets/key.png', { frameWidth: 30, frameHeight: 30 });

		this.load.spritesheet('canon', 'assets/canon.png', { frameWidth: 62, frameHeight: 46 });
		this.load.image('canon_ball', 'assets/canon_ball.png');
		this.load.spritesheet('bald_pirate', 'assets/bald_pirate.png', { frameWidth: 63, frameHeight: 67 });
		this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
		this.load.spritesheet('cucumber', 'assets/cucumber.png', { frameWidth: 64, frameHeight: 68 });
		this.load.spritesheet('big_guy', 'assets/big_guy.png', { frameWidth: 77, frameHeight: 74 });

		this.load.spritesheet('door', 'assets/door.png', { frameWidth: 78, frameHeight: 96 });
		this.load.image('platform', 'assets/platform.png');

		this.load.spritesheet('candle', 'assets/lighting/candle.png', { frameWidth: 14, frameHeight: 32 });
		this.load.spritesheet('candle_light', 'assets/lighting/candle_light.png', { frameWidth: 60, frameHeight: 58 });
		this.load.image('window', 'assets/lighting/window.png');
		this.load.spritesheet('window_light', 'assets/lighting/window_light.png', { frameWidth: 170, frameHeight: 139 });

		this.load.spritesheet('small_chain', 'assets/small_chain.png', { frameWidth: 9, frameHeight: 52 });
		this.load.spritesheet('big_chain', 'assets/big_chain.png', { frameWidth: 9, frameHeight: 100 });

		this.load.image('barrel', 'assets/decoration/barrel.png');
		this.load.image('blue_bottle', 'assets/decoration/blue_bottle.png');
		this.load.image('chair', 'assets/decoration/chair.png');
		this.load.image('green_bottle', 'assets/decoration/green_bottle.png');
		this.load.image('red_bottle', 'assets/decoration/red_bottle.png');
		this.load.image('table', 'assets/decoration/table.png');
		this.load.image('skull', 'assets/decoration/skull.png');
		this.load.image('spike', 'assets/spikes.png');

		this.load.bitmapFont('pixel', 'assets/font/pixel.png', 'assets/font/pixel.xml');

		this.load.aseprite('falling_barrel', 'assets/falling_barrel.png', 'assets/falling_barrel.json');
	}

	create() {
		this.hasLight = this.levels[this.currentLevel].hasLight;

		this.map = this.make.tilemap({ key: this.levels[this.currentLevel].tilemapKey, tileWidth: 64, tileHeight: 64 });
		this.tileset = this.map.addTilesetImage('tileset', 'tiles');
		this.groundLayer = this.map.createLayer('ground', this.tileset);
		this.groundLayer.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26]);
		this.platformsLayer = this.map.createLayer('platforms', this.tileset);
		this.platformsLayer.filterTiles(tile => tile.index > 0).forEach(tile => tile.setCollision(false, false, true, false, false))

		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

		this.createDoors();
		this.createMovingPlatforms();
		this.createFadingPlatforms();
		this.createFallingBarrels();
		this.createSpikes();
		this.createPlayer();
		this.createCamera();
		this.createLives();
		this.createKeys()
		this.createHealthBar();
		this.createEnemies();
		this.createPushableDecorations();
		this.createDecorations();
		//this.showMessageBox('Use Left and Right to run, Up to jump, Down to open a door, and Space to throw a bomb!')

		if (this.hasLight) this.createLight();

		//this.time.delayedCall(1000, () => text.destroy());

		//this.add.text(this.player.x, this.player.y, "this is a textasdsa", { fontSize: '25px', fontFamily: 'Pixelify Sans', fontStyle: '700', fill: '#000000', });

		//this.physics.add.collider(this.player.bombGroup, this.player.bombGroup, (bomb1, bomb2) => { bomb1.push(bomb2) }); // bomb with bomb

		this.physics.add.overlap(this.player.bombGroup, this.player, (player, bomb) => {
			if (bomb.exploded) {
				if (!player.isInvulnerable) this.push(bomb, player);
				player.takeDamage();
			}
		});
		this.physics.add.overlap(this.player.bombGroup, this.enemyGroup, (bomb, enemy) => {
			if (bomb.exploded) {
				if (!enemy.isInvulnerable) this.push(bomb, enemy);
				enemy.takeDamage();
				if (enemy.health === 0) {
					console.log('test')
					const live = new Life({ scene: this, x: enemy.x, y: enemy.y, textureKey: 'life_idle' });
					this.livesGroup.add(live);
				}
			}
		});
		this.physics.add.overlap(this.player.swordGroup, this.enemyGroup, (sword, enemy) => {
			if (!enemy.isInvulnerable) {
				this.push(sword, enemy);
				enemy.takeDamage();
				sword.destroy();
				if (enemy.health === 0) {
					console.log('test')
					// let rnd = Math.random();
					// if (rnd > 0.5) return
					//const live = new Sword(this, enemy.x, enemy.y, 'sword');
					//this.player.swordGroup.add(live);
				}
			}
		});
		this.physics.add.overlap(this.player.bombGroup, this.pushableDecorationGroup, (bomb, object) => {
			if (bomb.exploded) this.push(bomb, object);
		});

	}
	update() {
		this.movingXPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.movingYPlatformsGroup.getChildren().forEach(platform => platform.update());
		this.fallenBarrelsGroup.getChildren().forEach(barrel => barrel.update());
		this.player.update();
		this.healthBar.update();
		this.enemyGroup.getChildren().forEach(enemy => enemy.update());
	}

	showMessageBox(messageText) {
		if (this.messageBox) {
			this.messageBox.destroy();
			this.box.destroy();
			this.messageTimer.remove();
		}
		const { x, y, width, height } = this.cameras.main.worldView;
		this.messageBox = this.add.bitmapText(x + width / 2, height - 40, 'pixel', messageText, 20, 1).setMaxWidth(600).setOrigin(0.5, 1).setScrollFactor(0, 0).setDepth(31); //.setDropShadow(1, 1, '#323443');
		const bounds = this.messageBox.getTextBounds(true).global;
		this.box = this.add.rectangle(bounds.x - 20, bounds.y - 20, bounds.width + 40, bounds.height + 40, 0x323443, 0.9).setScrollFactor(0, 0).setDepth(30).setOrigin(0, 0); //323443
		this.messageTimer = this.time.delayedCall(3000, () => {
			this.messageBox.destroy();
			this.box.destroy();
		});
	}

	changeLevel(door) {
		if (door.id !== this.scene.currentLevel && door.id !== -1 && Phaser.Input.Keyboard.JustDown(this.player.keyDown) && !this.player.hasKey && this.player.body.onFloor()) return this.showMessageBox('I need a key!')
		if (door.id === this.scene.currentLevel || door.id === -1 || !this.player.cursors.down.isDown || !this.player.hasKey || !this.player.body.onFloor()) return
		door.anims.play('opening');
		door.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'opening', function (anims) {
			this.scene.restart({ level: door.id, playerData: this.player.getPlayerData() });
		}, this);

	}
	push(pusher, object) {
		const point = {
			x: object.getCenter().x + (object.getCenter().x > pusher.getCenter().x ? -200 : 200),
			y: object.getCenter().y + 200,
		}
		const angle = Phaser.Math.Angle.BetweenPoints(point, object.getCenter());
		this.physics.velocityFromRotation(angle, 150, object.body.velocity);
	}
	getObjectCoordinateX(gameObject) {
		return gameObject.x + gameObject.width * 0.5
	}

	getObjectCoordinateY(gameObject) {
		return gameObject.y - gameObject.height * 0.5
	}
	normalaizeCoordinateX(gameObject) {
		return Math.floor(gameObject.x / this.tileset.tileHeight) * this.tileset.tileHeight
	}
	normalaizeCoordinateY(gameObject) {
		return Math.floor(gameObject.y / this.tileset.tileHeight) * this.tileset.tileHeight - gameObject.height
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
		this.physics.add.collider(this.movingXPlatformsGroup, this.movingXPlatformsGroup, (platform) => platform.toogleDirection());
		this.physics.add.collider(this.movingYPlatformsGroup, this.movingYPlatformsGroup, (platform) => platform.toogleDirection());
		const layer = this.map.getObjectLayer('moving_platforms')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const type = object.properties.find(item => item.name === 'type').value;
			const movingPlatform = new MovingPlatform({
				scene: this,
				x: this.normalaizeCoordinateX(object),
				y: this.normalaizeCoordinateY(object),
				textureKey: 'platform',
				type,
			})
			if (type === 'HORIZONTAL') return this.movingXPlatformsGroup.add(movingPlatform);
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
	createFallingBarrels() {
		this.fallenBarrelsGroup = this.physics.add.group({
			allowGravity: false,
		});
		this.fallenBarrelCollidersGroup = this.physics.add.group({
			allowGravity: false,
		});
		const layer = this.map.getObjectLayer('falling_barrels')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const fallingBarrel = new FallingBarrel({
				scene: this,
				x: this.normalaizeCoordinateX(object),
				y: this.normalaizeCoordinateY(object),
				textureKey: 'falling_barrel',
			})
			this.fallenBarrelsGroup.add(fallingBarrel);
			this.fallenBarrelCollidersGroup.add(fallingBarrel.checkCollider);
		});
		this.physics.add.collider(this.fallenBarrelsGroup, [this.groundLayer, this.platformsLayer]);
	}
	createSpikes() {
		this.spikesGroup = this.physics.add.group({
			allowGravity: false,
		});
		const layer = this.map.getObjectLayer('spikes')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const spike = new Spike({
				scene: this,
				x: this.normalaizeCoordinateX(object),
				y: this.normalaizeCoordinateY(object),
				textureKey: 'spike',
			})
			this.spikesGroup.add(spike);
		});
	}
	createLives() {
		this.livesGroup = this.physics.add.group({
			immovable: true,
		});
		this.physics.add.collider(this.livesGroup, [this.groundLayer, this.platformsLayer]);
		this.physics.add.overlap(this.player, this.livesGroup, (player, life) => {
			if (!life.isActive && player.addLife()) life.disappear();
		});
		const layer = this.map.getObjectLayer('lives')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const live = new Life({ scene: this, x: object.x, y: object.y, textureKey: 'life_idle' });
			this.livesGroup.add(live);
		});
	}
	createKeys() {
		this.keysGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false,
		});
		this.keyOverlap = this.physics.add.overlap(this.player, this.keysGroup, (player, key) => {
			player.getKey();
			key.disappear();
			this.physics.world.removeCollider(this.keyOverlap);
		});
		const layer = this.map.getObjectLayer('keys')?.objects;
		if (!layer) return
		layer.forEach(object => {
			const key = new Key({ scene: this, x: this.getObjectCoordinateX(object), y: this.getObjectCoordinateY(object), textureKey: 'key' });
			this.keysGroup.add(key);
		});
	}
	createPlayer() {
		const door = this.doorGroup.getChildren().find(item => item.id === this.currentLevel - 1);
		const textures = {
			player: 'bomb_guy',
			bombBar: 'bomb_bar',
			particles: {
				run: 'run_particles',
				jump: 'jump_particles',
				land: 'land_particles',
			},
			inventory: {
				background: 'inventory',
				bomb: 'bomb_inventory',
				sword: 'sword_inventory',
				rum: 'rum_inventory',
			},
		}
		this.player = new Player({ scene: this, x: door.x, y: door.y + door.height * 0.5, textures, playerData: this.playerData });
		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup]);
		this.physics.add.collider(this.player, this.movingYPlatformsGroup, (player, platform) => player.touchingPlatform = platform); // create player method
		this.physics.add.collider(this.player, this.fadingPlatformsGroup, (player, platform) => {
			if (player.body.onFloor()) platform.fade();
		});
		this.physics.add.collider(this.player.bombGroup, [this.groundLayer, this.platformsLayer, this.movingXPlatformsGroup, this.movingYPlatformsGroup]); // more colissions?
		this.physics.add.overlap(this.player, this.doorGroup, (player, door) => this.changeLevel(door));
		this.physics.add.overlap(this.player, this.fallenBarrelCollidersGroup, (player, collider) => collider.barrel.fall());
		this.physics.add.overlap(this.player, this.fallenBarrelsGroup, (player, barrel) => {
			if (!player.isInvulnerable) this.push(barrel, player);
			player.takeDamage();
		});
		this.physics.add.overlap(this.player, this.spikesGroup, (player, spike) => {
			if (!player.isInvulnerable) this.push(spike, player);
			player.takeDamage();
		});
		this.physics.add.collider(this.player.swordGroup, this.groundLayer, (sword) => sword.destroy());
	}
	createCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);
		this.cameras.main.setRoundPixels(true);
	}
	createHealthBar() {
		const textures = {
			healthBar: 'health_bar',
			life: 'life',
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
		this.physics.add.collider([this.canonBallGroup, this.bottleGroup], [this.groundLayer], (projectile) => projectile.destroy());
		this.physics.add.overlap([this.canonBallGroup, this.bottleGroup], this.player, (player, projectile) => {
			if (!player.isInvulnerable) this.push(projectile, player);
			player.takeDamage();
		});
	}
	createPushableDecorations() {
		this.pushableDecorationGroup = this.physics.add.group({
			bounceX: 0.5,
			bounceY: 0.5,
			dragX: 100,
			dragY: 100,
		});
		if (!this.map.getObjectLayer('decorations')) return
		this.map.getObjectLayer('decorations').objects.forEach(object => {
			const textureKey = object.properties.find(item => item.name === 'texture').value;
			const newObject = new DecorationObject({
				scene: this,
				x: this.getObjectCoordinateX(object),
				y: this.getObjectCoordinateY(object),
				textureKey,
				flipX: object.flippedHorizontal,
			});
			this.pushableDecorationGroup.add(newObject);
		})
		this.physics.add.collider(this.pushableDecorationGroup, [this.groundLayer, this.platformsLayer, this.pushableDecorationGroup]);
	}
	createDecorations() {
		const layers = {
			'small_chains': { className: Chain, textureKey: 'small_chain' },
			'big_chains': { className: Chain, textureKey: 'big_chain' },
			'candles': { className: Candle, textureKey: 'candle' },
			'windows': { className: Window, textureKey: 'window' },
		}
		for (let key in layers) {
			const { className, textureKey } = layers[key];
			const layer = this.map.getObjectLayer(key);
			if (layer) layer.objects.forEach(object => {
				const newObject = new className({
					scene: this,
					x: this.getObjectCoordinateX(object),
					y: this.getObjectCoordinateY(object),
					textureKey
				});
			})
		}
	}
	createLight() {
		this.children.list.forEach(item => {
			if (!item.lifeTexture) item.setPipeline('Light2D');
			if (item.light) this.lights.addLight(item.x, item.y, 900, 0xffffff, 0.7);
		})
		this.lights.enable().setAmbientColor(0x000000);
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

console.log(getKeyFrames([38, 16, 1, 4, 2, 3, 11, 8, 1, 16, 11, 8, 6, 4]))