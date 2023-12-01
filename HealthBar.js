class HealthBar extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textures }) {
		super(scene, 0, 0, textures.healthBar);
		scene.add.existing(this);
		this.player = player;
		this.lifeTexture = textures.life;
		this.healthGroup = scene.add.group();
		this.offsetX = 100;
		this.offsetY = 10;
		this.setPosition(this.offsetX, this.offsetY).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(28);
	}

	update() {
		this.healthGroup.getChildren().forEach(item => item.destroy());
		//this.scene.add.image(10, this.scene.cameras.main.height - 10, 'inventory').setOrigin(0, 1).setScrollFactor(0, 0).setDepth(29);
		const { health } = this.player;
		const y = 22 + this.offsetY;
		const x = [40, 66, 92];
		for (let i = 0; i < health; i++) {
			const image = this.scene.add.image(x[i] + this.offsetX, y, this.lifeTexture).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(29);
			this.healthGroup.add(image);
		}
	}

}