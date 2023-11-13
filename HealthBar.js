class HealthBar extends Phaser.Physics.Arcade.Sprite {

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
		this.healthGroup.getChildren().forEach(item => item.destroy());
		this.scene.add.image(10, 400, 'inventory').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(29).setScale(1.5, 1.5);
		this.scene.add.image(48, 400, 'inventory').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(29);
		this.scene.add.image(86, 400, 'inventory').setOrigin(0, 0).setScrollFactor(0, 0).setDepth(29);
		const { health } = this.player;
		const y = 22 + this.offsetY;
		const x = [41, 65, 89];
		for (let i = 0; i < health; i++) {
			const image = this.scene.add.image(x[i] + this.offsetX, y, this.lifeTexture).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(29);
			this.healthGroup.add(image);
		}
	}

}