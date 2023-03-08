function preload() {
	this.load.image('tiles', './assets/tileset.png');
	this.load.tilemapTiledJSON('map', './assets/demo_level.json');
	this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
	this.load.spritesheet('bomb_bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
	this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
	this.load.spritesheet('bald_pirate', 'assets/bald_pirate.png', { frameWidth: 63, frameHeight: 67 });
	this.load.spritesheet('door', 'assets/door.png', { frameWidth: 78, frameHeight: 96 });
}

function create() {

	cursors = this.input.keyboard.createCursorKeys();
	keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
	tileset = map.addTilesetImage('tileset', 'tiles');
	groundLayer = map.createLayer('ground', tileset);
	groundLayer.setCollision([1, 2, 3, 7, 8, 9, 13, 14, 15, 19, 20, 25, 26]);
	platformsLayer = map.createLayer('platforms', tileset);
	platformsLayer.filterTiles(tile => tile.index > 0).forEach(tile => tile.setCollision(false, false, true, false, false))

	this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

	let doorInObject = map.getObjectLayer('door_in').objects[0];
	let doorIn = new Door({ scene: this, x: getObjectCoordinateX(doorInObject), y: getObjectCoordinateY(doorInObject), textureKey: 'door' });

	let playerObject = map.getObjectLayer('player').objects[0];
	player = new Player({ scene: this, x: getObjectCoordinateX(playerObject), y: getObjectCoordinateY(playerObject), textureKey: 'bomb_guy' });
	doorIn.openAndClose();

	bombBar = new BombBar({ scene: this, player, textureKey: 'bomb_bar' });
	bombs = new Bombs({ scene: this, textureKey: 'bomb' });

	enemies = this.physics.add.group();

	// let capitansLayer = map.getObjectLayer('capitans');
	// capitansLayer.objects.forEach(capitan => {
	// 	let newCapitan = new BaldPirate(this, capitan.x - capitan.width * 0.5, capitan.y - capitan.height * 0.5, 'bald_pirate');
	// 	enemies.add(newCapitan);
	// })

	let baldPiratesLayer = map.getObjectLayer('bald_pirates');
	baldPiratesLayer.objects.forEach(pirate => {
		let newCapitan = new BaldPirate(this, pirate.x - pirate.width * 0.5, pirate.y - pirate.height * 0.5, 'bald_pirate');
		enemies.add(newCapitan);
	})

	this.physics.add.collider(player, [groundLayer, platformsLayer]);
	this.physics.add.collider(enemies, [groundLayer, platformsLayer]);
	this.physics.add.collider(bombs, [groundLayer, platformsLayer]);

	camera = this.cameras.main;
	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	camera.startFollow(player, true, 1, 1, 0, 0);

}

function update() {
	player.currentState.handleInput({ cursors, keyUp });
	bombBar.update();
	enemies.getChildren().forEach(enemy => enemy.currentState.handleState())
	//enemies.getChildren().forEach(enemy => console.log(enemy.properties.direction))
	console.log(enemies.getChildren()[0].currentState.name)
}

function getObjectCoordinateX(gameObject) {
	return gameObject.x + gameObject.width * 0.5
}

function getObjectCoordinateY(gameObject) {
	return gameObject.y - gameObject.height * 0.5
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

console.log(getKeyFrames([34, 14, 1, 4, 2, 3, 12, 8, 6, 4]))