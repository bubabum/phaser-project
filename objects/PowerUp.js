class PowerUp extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.id = `${scene.currentLevel}${x}${y}`;
		this.setPosition(x, y);
		this.setDepth(25);
		this.createAnimations(textureKey);
		this.anims.play('idle');
	}

	getTileCenterX(x) {
		const { tileWidth } = this.scene.tileset;
		return Math.floor(x / tileWidth) * tileWidth + tileWidth / 2;
	}

	getTileCenter() {
		const { tileWidth, tileHeight } = this.scene.tileset;
		const x = Math.floor(this.x / tileWidth) * tileWidth + tileWidth / 2;
		const y = Math.floor(this.y / tileHeight) * tileHeight + tileHeight / 2;
		return [x, y]
	}

	disappear() {
		this.disableBody();
		this.anims.play('effect');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'effect', function (anims) {
			this.destroy();
		}, this);
	}

}