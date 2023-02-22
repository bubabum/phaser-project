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
			debug: false,
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
let bombVelocity = 0;
let bombMaxVelocity = 300;
let bombBar;

let lastFired = 0;

let game = new Phaser.Game(config);

function preload() {
	this.load.image('tiles', './assets/tile_map.png');
	this.load.image('platform', './assets/platform.png');
	this.load.tilemapTiledJSON('map', './assets/lv.json');
	this.load.spritesheet('player', './assets/player.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('player_hit', './assets/player_hit.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
	this.load.spritesheet('bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
	this.load.spritesheet('capitan', 'assets/enemy_capitan.png', { frameWidth: 80, frameHeight: 72 });
}

function create() {
	let game = this;
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
		key: 'hit',
		frames: this.anims.generateFrameNumbers('player_hit', {
			start: 0,
			end: 7,
		}),
		frameRate: 10,
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
	this.anims.create({
		key: 'explosion',
		frames: this.anims.generateFrameNumbers('bomb', {
			start: 10,
			end: 19,
		}),
		frameRate: 20,
		repeat: 0,
	});

	this.anims.create({
		key: 'charging',
		frames: this.anims.generateFrameNumbers('bar', {
			start: 0,
			end: 10,
		}),
		frameRate: 15,
		repeat: 0,
	});

	this.anims.create({
		key: 'idle_capitan',
		frames: this.anims.generateFrameNumbers('capitan', {
			start: 0,
			end: 31,
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

	//this.physics.world.setBounds(0, 0, 35 * TILE, 25 * TILE);

	player = this.physics.add.sprite(1600, 300, 'player');
	player.setSize(25, 50, false).setOffset(20, 8);
	//player.setCollideWorldBounds(true);
	player.anims.play('idle');

	bombBar = this.add.sprite(player.body.x, player.body.y, 'bar');
	bombBar.setVisible(false);

	bombs = this.physics.add.group({
		angularVelocity: 0,
		angularAcceleration: 0,
		velocityX: 0,
		maxSize: 3,
		defaultKey: 'bomb',
	});

	let capitansGroup = this.physics.add.group();
	let capitansArray = map.createFromObjects('enemies', [{ gid: 31, key: 'capitan', frame: 0 }]);

	for (var i = 0; i < capitansArray.length; i++) {
		capitansGroup.add(capitansArray[i]);
		capitansArray[i].body.setSize(30, 67, false).setOffset(20, 5);;
		capitansArray[i].anims.play('idle_capitan');
	}


	player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
		player.chain(['land', 'idle']);
	}, this);

	this.physics.add.collider(player, layer);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(capitansGroup, layer);
	this.physics.add.collider(capitansGroup, platforms);
	this.physics.add.collider(bombs, layer);
	this.physics.add.collider(bombs, platforms);

	cursors = this.input.keyboard.createCursorKeys();

	this.input.keyboard.on('keydown-SPACE', function (event) {
		bombBar.setVisible(true);
		bombBar.anims.play('charging');
	});

	this.input.keyboard.on('keyup-SPACE', function (event) {
		event.stopPropagation();
		bombBar.setVisible(false);
		let bomb = bombs.get(player.x + (player.flipX ? -15 : 15), player.y);
		if (bomb) {
			bomb.anims.play('on');
			bomb.setCircle(15).setOffset(34, 58).setOrigin(0.51, 0.67).setBounce(0.5).setVelocity((player.flipX ? -1 : 1) * bombVelocity, -bombVelocity).setDrag(20, 20);
			setTimeout(() => {
				bomb.anims.play('explosion');
				bomb.body.moves = false;
				bomb.setCircle(48).setOrigin(0.5, 0.5).setOffset(0, 12);
				let bombColider = game.physics.add.collider(player, bomb, () => {
					game.physics.world.removeCollider(bombColider);
					player.anims.play('hit');
					let angle = Phaser.Math.Angle.BetweenPoints(bomb.getCenter(), player.getCenter());
					game.physics.velocityFromRotation(angle, 200, player.body.velocity);
				});
				let bombEnemyColider = game.physics.add.collider(bomb, capitansGroup, (bomb, capitan) => {
					game.physics.world.removeCollider(bombEnemyColider);
					let angle = Phaser.Math.Angle.BetweenPoints(bomb.getCenter(), capitan.getCenter());
					game.physics.velocityFromRotation(angle, 200, capitan.body.velocity);
					capitan.body.setDrag(100, 20);
				});
			}, 2000)
			bomb.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'explosion', function (anims) {
				bomb.destroy();
			}, this);
			bombVelocity = 0;
		}

	});

	camera = this.cameras.main;
	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	camera.startFollow(player, true, 1, 1, 0, 0);
}

function update() {
	if (cursors.left.isDown && player.anims.currentAnim.key !== 'hit') {
		player.setVelocityX(-160);
		//player.flipX = true;
		if (player.body.blocked.down) player.anims.play('run', true);
	} else if (cursors.right.isDown && player.anims.currentAnim.key !== 'hit') {
		player.setVelocityX(160);
		//player.flipX = false;
		if (player.body.blocked.down) player.anims.play('run', true);
	} else {
		if (player.anims.currentAnim.key !== 'hit') {
			player.setVelocityX(0);
			if (player.body.blocked.down) player.anims.play('idle', true);
		}
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
	if (player.body.velocity.x < 0) player.setFlipX(true);
	if (player.body.velocity.x > 0) player.setFlipX(false);
	if (player.anims.currentAnim.key === 'hit' && player.body.velocity.x > 0) player.setFlipX(true)
	if (player.anims.currentAnim.key === 'hit' && player.body.velocity.x < 0) player.setFlipX(false)

	if (cursors.space.isDown && bombVelocity < bombMaxVelocity) {
		bombVelocity += 5;
	}

	bombs.getChildren().forEach(bomb => {
		if (bomb.body.velocity.x === 0) bomb.setAcceleration(0);
	})
	bombBar.setPosition(player.getCenter().x + 3, player.getCenter().y - 30)
}