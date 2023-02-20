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

let camera;

let game = new Phaser.Game(config);

function preload() {
	this.load.image('tiles', './assets/tile_map.png');
	this.load.tilemapTiledJSON('map', './assets/lv.json');
	this.load.spritesheet('player', './assets/player.png', { frameWidth: 58, frameHeight: 58 });
}

function create() {
	map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
	tileset = map.addTilesetImage('tile_map', 'tiles');
	layer = map.createLayer('ground', tileset);
	map.setCollision([0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 24, 25]);

	this.physics.world.setBounds(0, 0, 35 * TILE, 25 * TILE);

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

	player = this.physics.add.sprite(400, 300, 'player');
	player.setCollideWorldBounds(true);
	player.anims.play('idle');

	this.physics.add.collider(player, layer);

	player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
		player.chain(['land', 'idle']);
	}, this);

	cursors = this.input.keyboard.createCursorKeys();

	camera = this.cameras.main;
	camera.setBounds(0, 0, 35 * TILE, 25 * TILE);
	camera.startFollow(player, true, 1, 1, 0, 0);
}

function update() {
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
		player.setVelocityY(-350);
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
}