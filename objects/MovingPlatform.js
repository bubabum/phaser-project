class MovingPlatform extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, type, distance }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.type = type;
		this.path = this.createPath(x, y, distance);
		this.player = null;
		this.setOrigin(0, 0);
		this.setSize(64, 64);
		this.setOffset(0, 0);
		this.body.checkCollision.down = false;
		this.body.checkCollision.left = false;
		this.body.checkCollision.right = false;
		this.setDepth(22);
	}

	update() {
		let [pos, velocity] = [this.x, this.body.velocity.x];
		if (this.type === 'vertical') {
			[pos, velocity] = [this.y, this.body.velocity.y];
		}
		const { start, end } = this.path;
		if (pos > end && velocity > 0 || pos < start && velocity < 0) return this.toogleDirection();
	}

	createPath(x, y, distance) {
		let points = [x, x + distance];
		if (this.type === 'vertical') points = [y, y + distance];
		return { start: Math.min(...points), end: Math.max(...points) };
	}

	toogleDirection() {
		this.body.velocity.x *= -1;
		this.body.velocity.y *= -1;
	}

	// canMoveForward() {
	// 	const marginX = 5;
	// 	let k = 1;
	// 	if (this.body.velocity.y < 0 || this.body.velocity.x < 0) k = -1;
	// 	const isNextGroundTileCollidable = (layer, platform) => {
	// 		const { x, y, width, height } = platform.body;
	// 		const tileSize = this.scene.tileset.tileWidth;
	// 		let tile = layer.getTileAtWorldXY(x, y + ((tileSize + marginX + 0.5) * k));
	// 		if (this.type === 'HORIZONTAL') tile = layer.getTileAtWorldXY(x + width / 2 + (tileSize / 2 + marginX + 0.5) * k, y);
	// 		return tile?.collideUp
	// 	}
	// 	const nextPlatformTile = isNextGroundTileCollidable(this.scene.platformsLayer, this)
	// 	const nextGroundTile = isNextGroundTileCollidable(this.scene.groundLayer, this)
	// 	if (!nextGroundTile && !nextPlatformTile) return false
	// 	return true
	// }

}