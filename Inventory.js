class Inventory extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textures }) {
		super(scene, 0, 0, textures.healthBar);
		scene.add.existing(this);
		this.player = player;
		this.lifeTexture = textures.life;
		this.healthGroup = scene.add.group();
		this.offsetX = 10;
		this.offsetY = 10;
		this.setPosition(this.offsetX, this.offsetY).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(28);
	}

	update() {
		this.scene.add.image(10, this.scene.cameras.main.height - 10, 'inventory').setOrigin(0, 1).setScrollFactor(0, 0).setDepth(29);
	}

}