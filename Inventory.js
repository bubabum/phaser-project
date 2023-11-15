class Inventory extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textures }) {
		super(scene, 0, 0, textures);
		scene.add.existing(this);
		this.player = player;
		this.inventoryTextures = textures.inventory;
		this.activeItem = scene.add.image(10, this.scene.cameras.main.height - 10, 'bomb_inventory').setOrigin(0, 1).setScrollFactor(0, 0).setDepth(30);
		this.activeItemQuantity = scene.add.bitmapText(10, this.scene.cameras.main.height - 10, 'pixel', '99', 8, 1).setOrigin(1, 1).setScrollFactor(0, 0).setDepth(31);
	}

	changeActiveItem() {
		this.player.activeItem++
		if (this.player.activeItem > Object.keys(this.player.inventoryData).length - 1) this.player.activeItem = 0;
		const activeItem = Object.keys(this.player.inventoryData)[this.player.activeItem];
		this.scene.showMessageBox(activeItem.split('')[0].toUpperCase() + activeItem.slice(1, activeItem.length));
	}

	update() {
		const texture = this.inventoryTextures[Object.keys(this.player.inventoryData)[this.player.activeItem]];
		const quantity = Object.values(this.player.inventoryData)[this.player.activeItem];
		this.activeItem.destroy();
		this.activeItemQuantity.destroy();
		this.activeItem = this.scene.add.image(10, this.scene.cameras.main.height - 10, texture).setOrigin(0, 1).setScrollFactor(0, 0).setDepth(30);
		this.activeItemQuantity = this.scene.add.bitmapText(this.activeItem.x + 54, this.activeItem.y - 38, 'pixel', `${quantity}`, 16, 1).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(31);
	}

}