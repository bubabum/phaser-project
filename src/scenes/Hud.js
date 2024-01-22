export class Hud extends Phaser.Scene {

	constructor() {
		super({
			key: 'Hud',
			active: true,
		});
		this.lives = [];
	}

	create() {
		this.registry.events.on('setdata', this.createHud, this);
		this.registry.events.on('changedata', this.updateData, this);
	}

	update() {
		if (this.fpsCounter) this.fpsCounter.setText(Math.floor(this.sys.game.loop.actualFps));
	}

	updateData(parent, key, data) {
		if (key !== 'playerData') return
		this.continue.setText(data.continue);
		this.drawLives(data.health);
		this.sword.setText(data.inventory.sword);
		this.rum.setText(data.inventory.rum);
		this.key.setVisible(data.collected.has(`${data.currentLevel}key`));
	}

	createHud(parent, key, data) {
		if (key !== 'playerData') return
		const { width, height } = this.cameras.main.worldView;
		this.add.image(10, 10, this.textures.get('continue_hud'))
			.setOrigin(0, 0)
			.setDepth(30);
		this.continue = this.add.bitmapText(50, 34, 'font', data.continue, 16, 1)
			.setOrigin(0, 0.5)
			.setDepth(30);
		this.add.image(75, 10, this.textures.get('health_bar'))
			.setOrigin(0, 0)
			.setDepth(30);
		this.drawLives(data.health);
		this.key = this.add.image(10, 50, this.textures.get('key_hud'))
			.setVisible(data.collected.has(`${data.currentLevel}key`))
			.setOrigin(0, 0)
			.setDepth(30);
		this.inventory = this.add.rectangle(width * 0.5, height - 26, 80, 32, 0xfdcaab, 0).setDepth(29).setOrigin(0.5, 0.5).setStrokeStyle(1, 0xffffff, 0);
		this.add.image(width * 0.5 - 30, this.inventory.y, this.textures.get('sword_hud'))
			.setOrigin(0.5, 0.5)
			.setDepth(30);
		this.sword = this.add.bitmapText(width * 0.5 - 10, this.inventory.y + 9, 'font', data.inventory.sword, 12, 1)
			.setOrigin(0.5, 0.5)
			.setDepth(30);
		this.add.image(width * 0.5 + 10, this.inventory.y, this.textures.get('rum_hud'))
			.setOrigin(0.5, 0.5)
			.setDepth(30);
		this.rum = this.add.bitmapText(width * 0.5 + 30, this.inventory.y + 9, 'font', data.inventory.rum, 12, 1)
			.setOrigin(0.5, 0.5)
			.setDepth(30);
		// this.fpsCounter = this.add.bitmapText(width - 10, 10, 'font', '', 20, 1)
		// 	.setOrigin(1, 0)
		// 	.setDepth(100);
	}

	drawLives(health) {
		this.lives?.forEach(life => life.destroy());
		for (let i = 0; i < health; i++) {
			const life = this.add.image(115 + i * 26, 32, this.textures.get('life_hud'))
				.setOrigin(0, 0)
				.setDepth(31);
			this.lives.push(life);
		}
	}

}