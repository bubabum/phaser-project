function preload() {
	this.load.image('tiles', './assets/tileset.png');
	this.load.tilemapTiledJSON('map', './assets/demo_level.json');
	this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
	this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });
	this.load.spritesheet('bomb_bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
	this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
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
	console.log(map)

	this.physics.world.setBounds(0, 0, 35 * TILE, 25 * TILE);

	player = new Player({ scene: this, x: 250, y: 300, textureKey: 'bomb_guy' });
	bombBar = new BombBar({ scene: this, player, textureKey: 'bomb_bar' });
	bombs = new Bombs({ scene: this, textureKey: 'bomb' });

	enemies = this.physics.add.group();

	let capitansLayer = map.getObjectLayer('capitans');
	capitansLayer.objects.forEach(capitan => {
		let newCapitan = new Capitan(this, capitan.x - capitan.width * 0.5, capitan.y - capitan.height * 0.5, 'capitan');
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
}

// function walkingBehavior(layer, npc) {
// 	const isLeftOrientated = (npc) => {
// 		return npc.body.velocity.x < 0
// 	}
// 	const isNextGroundTileCollidable = (layer, npc, isLeftOrientated) => {
// 		const { x, y, width, height } = npc.body;
// 		const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
// 		const tile = layer.getTileAtWorldXY(posX, y + height + 0.5);
// 		return tile?.collideUp
// 	}
// 	const isNextTileCollidable = (layer, npc, isLeftOrientated) => {
// 		const { x, y, width, height } = npc.body;
// 		const posX = x + (isLeftOrientated ? -0.5 : width + 0.5);
// 		const tile = layer.getTileAtWorldXY(posX, y + height - 0.5);
// 		if (isLeftOrientated) return tile?.collideRight;
// 		return tile?.collideLeft;
// 	}
// 	const nextGroundTile = isNextGroundTileCollidable(layer, npc, isLeftOrientated(npc))
// 	const nextTile = isNextTileCollidable(layer, npc, isLeftOrientated(npc))
// 	if (!nextGroundTile || nextTile) {
// 		npc.body.setVelocityX(-npc.body.velocity.x);
// 	}
// }