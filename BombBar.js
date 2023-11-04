class BombBar extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textureKey }) {
		super(scene, player.body.x, player.body.y - 15, textureKey);
		scene.add.existing(this);
		this.player = player;
		this.setVisible(false);
		this.createAnimations(textureKey);
		this.setDepth(25);
	}

	update() {
		this.setPosition(this.player.body.center.x, this.player.body.y - 15);
	}

	startCharging() {
		this.setVisible(true);
		this.anims.play('CHARGING');
	}

	stopCharging() {
		this.setVisible(false);
		return this.anims.getProgress();
	}

	isVisible() {
		return this.visible
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'CHARGING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 10 }),
			frameRate: 15,
			repeat: 0,
		});
	}

}