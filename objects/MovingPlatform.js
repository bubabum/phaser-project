class MovingPlatform extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, axis, distance }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.axis = axis;
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
		if (this.axis === 'y') {
			[pos, velocity] = [this.y, this.body.velocity.y];
		}
		const { start, end } = this.path;
		if (pos > end && velocity > 0 || pos < start && velocity < 0) return this.toogleDirection();
	}

	createPath(x, y, distance) {
		let points = [x, x + distance];
		if (this.axis === 'y') points = [y, y + distance];
		return { start: Math.min(...points), end: Math.max(...points) };
	}

	toogleDirection() {
		this.body.velocity.x *= -1;
		this.body.velocity.y *= -1;
	}

}