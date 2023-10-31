class MainScene extends Phaser.Scene {
	//currentLevel

	constructor() {
		super({ key: 'MainScene' })
		this.levels = [
			{ tilemapKey: 'map', hasLight: false },
			{ tilemapKey: 'map2', hasLight: false },
		];
	}

	init(props) {
		const { level = 0 } = props
		this.currentLevel = level;
	}

	preload() {
		this.load.image('tiles', './assets/tileset.png');
		this.load.tilemapTiledJSON('map', './assets/demo_level.json');
		this.load.tilemapTiledJSON('map2', './assets/demo_level2.json');

		this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
		this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
		this.load.spritesheet('bomb_bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
		this.load.image('health_bar', 'assets/health_bar.png');
		this.load.image('life', 'assets/life.png');

		this.load.spritesheet('canon', 'assets/canon.png', { frameWidth: 62, frameHeight: 46 });
		this.load.image('canon_ball', 'assets/canon_ball.png');
		this.load.spritesheet('bald_pirate', 'assets/bald_pirate.png', { frameWidth: 63, frameHeight: 67 });
		this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
		this.load.spritesheet('cucumber', 'assets/cucumber.png', { frameWidth: 64, frameHeight: 68 });
		this.load.spritesheet('big_guy', 'assets/big_guy.png', { frameWidth: 77, frameHeight: 74 });

		this.load.spritesheet('door', 'assets/door.png', { frameWidth: 78, frameHeight: 96 });

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

		this.doorGroup = this.physics.add.group({
			immovable: true,
			allowGravity: false
		});
		this.enemyGroup = this.physics.add.group();
		this.enemyHurtboxGroup = this.physics.add.group();
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
		this.pushableDecorationGroup = this.physics.add.group({
			bounceX: 0.5,
			bounceY: 0.5,
			dragX: 100,
			dragY: 100,
		});

		this.createDoors();
		this.createPlayer();
		this.createCamera();
		this.createHealthBar();
		this.createEnemies();
		this.createPushableDecorations();
		this.createDecorations();

		if (this.hasLight) this.createLight();

		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer]);
		this.physics.add.collider(this.enemyGroup, [this.groundLayer, this.platformsLayer]);
		this.physics.add.collider(this.player.bombGroup, [this.groundLayer, this.platformsLayer]); // more colissions?
		this.physics.add.overlap(this.player.bombGroup, this.player, (player, bomb) => player.takeBombDamage(bomb));
		this.physics.add.overlap(this.player.bombGroup, this.enemyGroup, (bomb, enemy) => enemy.takeBombDamage(bomb));
		this.physics.add.overlap(this.player.bombGroup, this.pushableDecorationGroup, (bomb, object) => bomb.push(object));
		this.physics.add.overlap(this.enemyHurtboxGroup, this.player, (player, hurtbox) => hurtbox.atack(player));
		this.physics.add.collider([this.canonBallGroup, this.bottleGroup], [this.groundLayer], (projectile) => projectile.destroy());

		this.physics.add.overlap([this.canonBallGroup, this.bottleGroup], this.player, (player, projectile) => player.takeDamage(projectile));

		this.physics.add.collider(this.pushableDecorationGroup, [this.groundLayer, this.platformsLayer, this.pushableDecorationGroup]);

		this.physics.add.overlap(this.doorGroup, this.player, (player, door) => this.changeLevel(door));

	}
	update() {
		this.player.update();
		this.healthBar.update();
		this.enemyGroup.getChildren().forEach(enemy => {
			enemy.currentState.handleState();
			enemy.drawHealthBar();
		});
	}

	changeLevel(door) {
		if (door.id === this.scene.currentLevel || door.id === -1 || !this.player.cursors.down.isDown) return
		this.player.setState('DOOR_IN');
		door.anims.play('opening');
		door.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'opening', function (anims) {
			this.scene.restart({ level: door.id });
		}, this);

	}

	getObjectCoordinateX(gameObject) {
		return gameObject.x + gameObject.width * 0.5
	}

	getObjectCoordinateY(gameObject) {
		return gameObject.y - gameObject.height * 0.5
	}
	createDoors() {
		this.map.getObjectLayer('doors').objects.forEach(object => {
			const id = object.properties.find(item => item.name === 'id').value;
			const door = new Door({ scene: this, x: this.getObjectCoordinateX(object), y: this.getObjectCoordinateY(object), textureKey: 'door', id });
			this.doorGroup.add(door);
		});
	}
	createPlayer() {
		const door = this.doorGroup.getChildren().find(item => item.id === this.currentLevel - 1);
		const textures = {
			player: 'bomb_guy',
			bombBar: 'bomb_bar',
			healthBar: 'health_bar',
			life: 'life',
		}
		this.player = new Player({ scene: this, x: door.x, y: door.y + door.height * 0.5, textures });
	}
	createCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player, true, 1, 1, 0, 0);
	}
	createHealthBar() {
		const textures = {
			healthBar: 'health_bar',
			life: 'life',
		}
		this.healthBar = new HealthBar({ scene: this, player: this.player, textures });
	}
	createEnemies() {
		const classes = {
			'BaldPirate': BaldPirate,
			'Capitan': Capitan,
			'Canon': Canon,
			'Cucumber': Cucumber,
			'BigGuy': BigGuy,
		}
		if (!this.map.getObjectLayer('enemies')) return
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
		})
	}
	createPushableDecorations() {
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
		this.children.list.forEach(item => item.setPipeline('Light2D'))
		this.children.list.forEach(item => {
			if (item.light) this.lights.addLight(item.x, item.y, 900, 0xffffff, 0.7);
		})
		this.lights.enable().setAmbientColor(0x000000);
	}
}

function getKeyFrames(array) {
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


// this.states2 = {
// 	'IDLE': {
// 		eneter: () => {
// 			console.log('enter idle');
// 			setTimeout(() => this.setState2('RUN'), 3000);
// 		},
// 		handle: () => console.log('handle idle'),
// 	},
// 	'RUN': {
// 		eneter: () => {
// 			console.log('enter run');
// 			setTimeout(() => this.setState2('IDLE'), 3000);
// 		},
// 		handle: () => console.log('handle run'),
// 	}
// }


// this.currentState2 = this.states2['IDLE'];
// this.currentState2.eneter();

// setState2(name) {
// 	this.currentState2 = this.states2[name];
// 	this.currentState2.eneter()
// }