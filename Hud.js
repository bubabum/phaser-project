class Hud extends Phaser.Scene {

	constructor() {
		super({
			key: 'Hud',
			active: true,
		});
	}

	create() {
		console.log(this)

		// const playerData = this.registry.get('playerData');
		// this.draw(playerData)
		//this.continue = this.add.image(10, 200, this.textures.get('barrel'))
		// .setOrigin(0, 1)
		// .setScrollFactor(0, 0)
		// .setDepth(30);
		//this.continueQuantity = this.add.bitmapText(24, 38, 'pixel', data.continue, 16, 1)
		this.registry.events.on('setdata', this.createHud, this);
		this.registry.events.on('changedata', this.updateData, this);
	}

	update() {
		//this.continue = this.add.image(10, 200, this.textures.get('continue'))
	}

	updateData(parent, key, data) {
		if (key !== 'playerData') return
		this.continue.setText(data.continue)
	}

	draw(data) {
		console.log(data)

	}

	createHud(parent, key, data) {
		if (key !== 'playerData') return
		this.add.image(10, 10, this.textures.get('continue_inventory'))
			.setOrigin(0, 0)
			.setDepth(30);
		this.continue = this.add.bitmapText(50, 26, 'pixel', data.continue, 16, 1)
			.setOrigin(0, 0.5)
			.setDepth(30)
			.setDropShadow(1, 1);
	}

}