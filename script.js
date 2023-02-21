const TILE = 64;
let config = {
	type: Phaser.AUTO,
	// width: 16 * TILE,
	// height: 9 * TILE,
	scale: {
		mode: Phaser.Scale.FIT,
		//mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
		//parent: 'phaser-example',
		//autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 16 * TILE,
		height: 9 * TILE,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 },
			debug: true,
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	}
};

let player;
let cursors;
let map;
let tileset;
let layer;
let platforms;

let follower;
let path;

let camera;

let bombs;
let bomb;

let lastFired = 0;

let game = new Phaser.Game(config);

function preload() {
	this.load.image('tiles', './assets/tile_map.png');
	this.load.image('platform', './assets/platform.png');
	this.load.tilemapTiledJSON('map', './assets/lv.json');
	this.load.spritesheet('player', './assets/player.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
}

function create() {
	this.anims.create({
		key: 'idle',
		frames: this.anims.generateFrameNumbers('player', {
			start: 0,
			end: 25,
		}),
		frameRate: 20,
		repeat: -1,
	});
	this.anims.create({
		key: 'run',
		frames: this.anims.generateFrameNumbers('player', {
			start: 26,
			end: 39,
		}),
		frameRate: 20,
		repeat: -1,
	});
	this.anims.create({
		key: 'jump',
		frames: this.anims.generateFrameNumbers('player', {
			start: 40,
			end: 43,
		}),
		frameRate: 20,
		repeat: 0,
	});
	this.anims.create({
		key: 'fall',
		frames: this.anims.generateFrameNumbers('player', {
			start: 47,
			end: 48,
		}),
		frameRate: 20,
		repeat: 0,
	});
	this.anims.create({
		key: 'land',
		frames: this.anims.generateFrameNumbers('player', {
			start: 44,
			end: 46,
		}),
		frameRate: 20,
		repeat: 0,
	});

	this.anims.create({
		key: 'on',
		frames: this.anims.generateFrameNumbers('bomb', {
			start: 0,
			end: 9,
		}),
		frameRate: 20,
		repeat: -1,
	});
	map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
	tileset = map.addTilesetImage('tile_map', 'tiles');
	layer = map.createLayer('ground', tileset);
	map.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26]);
	platforms = map.createLayer('platforms', tileset);
	platforms.forEachTile(tile => {
		let colissionIndexArray = [23, 24, 29, 30];
		if (colissionIndexArray.includes(tile.index)) {
			tile.setCollision(false, false, true, false);
		}
	});


	// let mov = map.createFromObjects('platforms1', { gid: 30, key: 'platform' });
	// const plats = this.physics.add.group(mov);
	// plats.getChildren().forEach(plat => {
	// 	plat.body.setImmovable(true);
	// 	plat.body.allowGravity = false;
	// 	plat.body.checkCollision.left = false;
	// 	plat.body.checkCollision.right = false;
	// 	plat.body.checkCollision.down = false;
	// })

	//this.physics.world.setBounds(0, 0, 35 * TILE, 25 * TILE);

	player = this.physics.add.sprite(1600, 300, 'player');
	player.setSize(25, 50, false);
	player.body.offset.x = 20;
	player.body.offset.y = 8;
	//player.setCollideWorldBounds(true);
	player.anims.play('idle');


	bombs = this.physics.add.group({
		angularVelocity: 0,
		angularAcceleration: 0,
		velocityX: 200,
		maxSize: 3,
		defaultKey: 'bomb',
	});

	this.physics.add.collider(player, layer);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(player, bombs);
	this.physics.add.collider(layer, bombs);

	player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
		player.chain(['land', 'idle']);
	}, this);

	cursors = this.input.keyboard.createCursorKeys();

	this.input.keyboard.on('keydown-SPACE', function (event) {

		event.stopPropagation();
		bomb = bombs.create(player.x, player.y, 'bomb');
		bomb.setCircle(15).setOrigin(0.51, 0.67).setBounce(0.5);
		bomb.body.offset.x = 34;
		bomb.body.offset.y = 58;
		bomb.body.setImmovable(false);
		bomb.anims.play('on');
		setTimeout(() => bomb.destroy(), 500)

	});

	camera = this.cameras.main;
	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	camera.startFollow(player, true, 1, 1, 0, 0);
}

function update(time, delta) {
	if (cursors.left.isDown) {
		player.setVelocityX(-160);
		player.flipX = true;
		if (player.body.blocked.down) player.anims.play('run', true);
	} else if (cursors.right.isDown) {
		player.setVelocityX(160);
		player.flipX = false;
		if (player.body.blocked.down) player.anims.play('run', true);
	} else {
		player.setVelocityX(0);
		if (player.body.blocked.down) player.anims.play('idle', true);
	}
	if (!cursors.up.isDown && player.body.blocked.down) {
		player.allowedToJump = true;
	}
	if (cursors.up.isDown && player.body.blocked.down && player.allowedToJump) {
		player.setVelocityY(-320);
		player.anims.play('jump', true);
		player.allowedToJump = false;
		player.hitGround = false;
	}
	if (!player.body.blocked.down && player.body.velocity.y > 0 && player.anims.currentAnim.key !== 'fall') {
		player.anims.play('fall', true);
	}
	if (player.body.velocity.y === 0 && player.body.onFloor() && !player.hitGround) {
		player.hitGround = true;
		player.anims.play('land', true);
	}
	if (cursors.space.isDown) {
		// bomb = bombs.create(player.x, player.y, 'bomb');
		// bomb.setCircle(15).setOrigin(0.51, 0.67).setBounce(0.5);
		// bomb.body.offset.x = 34;
		// bomb.body.offset.y = 58;
		// bomb.body.setImmovable(false);
		// bomb.anims.play('on');
	}

	// if (bomb.body.angularVelocity < 0) {
	// 	bomb.body.angularAcceleration = 0;
	// }
	// if (bomb.body.velocity.x > 0) {
	// 	bomb.body.velocity.x -= 1;
	// }
	// if (bomb.body.velocity.x < 0) {
	// 	bomb.body.velocity.x += 1;
	// }
}