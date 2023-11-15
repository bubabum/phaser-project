class Inventory extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textures }) {
		super(scene, 0, 0, textures);
		scene.add.existing(this);
		this.player = player;
		this.inventoryTextures = textures.inventory;
		this.continueTexture = textures.continue;
		this.drawInventory(false);
	}

	changeActiveItem() {
		this.player.activeItem++
		if (this.player.activeItem > Object.keys(this.player.inventoryData).length - 1) this.player.activeItem = 0;
		const activeItem = Object.keys(this.player.inventoryData)[this.player.activeItem];
		this.scene.showMessageBox(activeItem.split('')[0].toUpperCase() + activeItem.slice(1, activeItem.length));
	}

	drawInventory(destroy = true) {
		if (destroy) {
			this.continue.destroy();
			this.continueQuantity.destroy();
			this.activeItem.destroy();
			this.activeItemQuantity.destroy();
		}
		const itemTexture = this.inventoryTextures[Object.keys(this.player.inventoryData)[this.player.activeItem]];
		const itemQuantity = Object.values(this.player.inventoryData)[this.player.activeItem];
		this.continue = this.scene.add.image(10, this.scene.cameras.main.height - 10, this.continueTexture)
			.setOrigin(0, 1)
			.setScrollFactor(0, 0)
			.setDepth(30);
		this.continueQuantity = this.scene.add.bitmapText(this.continue.x + 54, this.continue.y - 38, 'pixel', this.player.continue, 16, 1)
			.setOrigin(0, 0)
			.setScrollFactor(0, 0)
			.setDepth(30);
		this.activeItem = this.scene.add.image(this.continue.x + 85, this.continue.y, itemTexture)
			.setOrigin(0, 1)
			.setScrollFactor(0, 0)
			.setDepth(30);
		this.activeItemQuantity = this.scene.add.bitmapText(this.activeItem.x + 54, this.activeItem.y - 38, 'pixel', itemQuantity, 16, 1)
			.setOrigin(0, 0)
			.setScrollFactor(0, 0)
			.setDepth(30);
	}

	update() {
		this.drawInventory();
	}
}