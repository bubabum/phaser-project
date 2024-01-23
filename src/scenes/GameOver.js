export class GameOver extends Phaser.Scene {

	constructor() {
		super({
			key: 'GameOver',
		});
	}

	preload() {
	}

	create() {
		const { width, height } = this.game.config;
		const progress = this.add.graphics();
		progress.fillStyle(0x56505b, 1);
		progress.fillRect(0, 0, width, height);
		this.add.bitmapText(width * 0.5, 150, 'font', 'Game Over', 32, 1).setOrigin(0.5, 0.5);
		this.playerImage = this.add.sprite(width * 0.5, 250, 'bomb_guy').setOrigin(0.5, 0.5).setScale(3);
		this.playerImage.anims.create({
			key: 'dead_ground',
			frames: this.anims.generateFrameNumbers('bomb_guy', { start: 64, end: 67 }),
			frameRate: 10,
			repeat: -1
		});
		this.playerImage.play('dead_ground');
		this.time.delayedCall(3000, () => this.scene.start('Menu'));
	}

	update() {
	}

}