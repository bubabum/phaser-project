function preload() {
	this.load.image('tiles', './assets/tile_map.png');
	this.load.tilemapTiledJSON('map', './assets/lv.json');
	this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
	this.load.spritesheet('bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
	this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
}

function create() {
	let game = this;


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

	// this.anims.create({
	// 	key: 'idle_capitan',
	// 	frames: this.anims.generateFrameNumbers('capitan', {
	// 		start: 0,
	// 		end: 31,
	// 	}),
	// 	frameRate: 20,
	// 	repeat: -1,
	// });

	map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
	tileset = map.addTilesetImage('tile_map', 'tiles');
	groundLayer = map.createLayer('ground', tileset);
	map.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26]);
	platforms = map.createLayer('platforms', tileset);
	platforms.forEachTile(tile => {
		let colissionIndexArray = [23, 24, 29, 30];
		if (colissionIndexArray.includes(tile.index)) {
			tile.setCollision(false, false, true, false);
		}
	});

	//this.physics.world.setBounds(0, 0, 35 * TILE, 25 * TILE);

	player = new Player({ scene: this, x: 1600, y: 300, textureKey: 'bomb_guy' });

	//player.setTexture('player');
	//player.body.setSize(25, 50, false).setOffset(20, 8);
	//player.setCollideWorldBounds(true);
	//player.anims.play('idle');

	//bombBar = this.add.sprite(player.body.x, player.body.y, 'bar');
	//bombBar.setVisible(false);

	bombs = this.physics.add.group({
		angularVelocity: 0,
		angularAcceleration: 0,
		velocityX: 0,
		maxSize: 3,
		defaultKey: 'bomb',
	});

	capitansGroup = this.physics.add.group();
	let capitansArray = map.createFromObjects('enemies', [{ gid: 31, key: 'capitan', frame: 0 }]);

	for (var i = 0; i < capitansArray.length; i++) {
		capitansGroup.add(capitansArray[i]);
		capitansArray[i].body.setSize(30, 67, false).setOffset(20, 5);
		capitansArray[i].anims.create({
			key: 'run',
			frames: this.anims.generateFrameNumbers('capitan', { start: 32, end: 45 }),
			frameRate: 20,
			repeat: -1,
		});
		capitansArray[i].anims.create({
			key: 'atack',
			frames: this.anims.generateFrameNumbers('capitan', { start: 56, end: 62 }),
			frameRate: 20,
			repeat: -1,
		});
		capitansArray[i].anims.play('run');
		capitansArray[i].body.setVelocityX(120);
	}


	player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
		player.chain(['land', 'idle']);
	}, this);

	this.physics.add.collider(player, groundLayer);
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(capitansGroup, groundLayer);
	this.physics.add.collider(capitansGroup, platforms);
	this.physics.add.collider(bombs, groundLayer);
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
	let game = this;
	player.currentState.handleInput(cursors);
	// if (cursors.left.isDown && player.anims.currentAnim.key !== 'hit') {
	// 	player.body.setVelocityX(-160);
	// 	//player.flipX = true;
	// 	if (player.body.blocked.down) player.anims.play('run', true);
	// } else if (cursors.right.isDown && player.anims.currentAnim.key !== 'hit') {
	// 	player.setVelocityX(160);
	// 	//player.flipX = false;
	// 	if (player.body.blocked.down) player.anims.play('run', true);
	// } else {
	// 	if (player.anims.currentAnim.key !== 'hit') {
	// 		player.body.setVelocityX(0);
	// 		if (player.body.blocked.down) player.anims.play('idle', true);
	// 	}
	// }
	// if (!cursors.up.isDown && player.body.blocked.down) {
	// 	player.allowedToJump = true;
	// }
	// if (cursors.up.isDown && player.body.blocked.down && player.allowedToJump) {
	// 	player.setVelocityY(-250);
	// 	player.anims.play('jump', true);
	// 	player.allowedToJump = false;
	// 	player.hitGround = false;
	// }
	// if (!player.body.blocked.down && player.body.velocity.y > 0 && player.anims.currentAnim.key !== 'fall') {
	// 	player.anims.play('fall', true);
	// }
	// if (player.body.velocity.y === 0 && player.body.onFloor() && !player.hitGround) {
	// 	player.hitGround = true;
	// 	player.anims.play('ground', true);
	// }
	// if (player.body.velocity.x < 0) {
	// 	player.setFlipX(true);
	// 	//player.body.offset.x = 13;
	// }
	// if (player.body.velocity.x > 0) {
	// 	player.setFlipX(false);
	// 	//player.body.offset.x = 20;
	// 	//player.setOffset(player.width - player.body.width - player.body.offset.x);
	// }
	// if (player.anims.currentAnim.key === 'hit' && player.body.velocity.x > 0) player.setFlipX(true)
	// if (player.anims.currentAnim.key === 'hit' && player.body.velocity.x < 0) player.setFlipX(false)

	if (cursors.space.isDown && bombVelocity < bombMaxVelocity) {
		bombVelocity += 5;
	}

	bombs.getChildren().forEach(bomb => {
		if (bomb.body.velocity.x === 0) bomb.setAcceleration(0);
	})
	//bombBar.setPosition(player.getCenter().x + 3, player.getCenter().y - 30)

	capitansGroup.getChildren().forEach(capitan => {
		walkingBehavior(groundLayer, capitan);
		if (Phaser.Math.Distance.BetweenPoints(player, capitan) < 40 && capitan.anims.currentAnim.key !== 'atack') {
			capitan.body.stop();
			capitan.anims.play('atack');
		}
		if (Phaser.Math.Distance.BetweenPoints(player, capitan) > 40 && capitan.anims.currentAnim.key !== 'run') {
			capitan.body.setVelocityX(120);
			capitan.anims.play('run');
		}
	})
}

function walkingBehavior(layer, npc) {
	const isLeftOrientated = (npc) => {
		return npc.body.velocity.x < 0
	}
	const isNextGroundTileCollidable = (layer, npc, isLeftOrientated) => {
		const { x, y, width, height } = npc.body;
		const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
		const tile = layer.getTileAtWorldXY(posX, y + height + 0.5);
		return tile?.collideUp
	}
	const isNextTileCollidable = (layer, npc, isLeftOrientated) => {
		const { x, y, width, height } = npc.body;
		const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
		const tile = layer.getTileAtWorldXY(posX, y + height - 0.5);
		if (isLeftOrientated) return tile?.collideRight;
		return tile?.collideLeft;
	}
	const nextGroundTile = isNextGroundTileCollidable(layer, npc, isLeftOrientated(npc))
	const nextTile = isNextTileCollidable(layer, npc, isLeftOrientated(npc))
	if (!nextGroundTile || nextTile) {
		npc.body.setVelocityX(-npc.body.velocity.x);
		npc.toggleFlipX();
	}
}