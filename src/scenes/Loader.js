export class Loader extends Phaser.Scene {

	constructor() {
		super({
			key: 'Loader',
			pack: {
				files: [
					{
						type: 'spritesheet',
						key: 'bomb',
						url: 'assets/sprites/bomb.png',
						frameConfig: { frameWidth: 96, frameHeight: 108 }
					},
					{
						type: "bitmapFont",
						key: "font",
						textureURL: "./assets/font/ps2p.png",
						fontDataURL: "./assets/font/ps2p.fnt"
					}
				]
			}
		});
	}

	init() {
		const { width, height } = this.game.config;
		const progress = this.add.graphics();
		progress.fillStyle(0x56505b, 1);
		progress.fillRect(0, 0, width, height);
		const config = {
			key: 'on',
			frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 9 }),
			frameRate: 15,
			repeat: -1
		};

		this.anims.create(config);
		this.add.sprite(width * 0.5, height * 0.5 - 50, 'bomb').play('on');
	}

	preload() {
		const progress = this.add.graphics();
		const { width, height } = this.game.config;
		const padding = 150;
		const [x, y, w, h] = [padding, height * 0.5, width - padding * 2, 20]
		this.add.bitmapText(width * 0.5, height * 0.5 + 50, 'font', 'Loading...', 20, 1).setOrigin(0.5, 0.5);
		this.load.on('progress', value => {
			progress.clear();
			progress.lineStyle(2, 0xcb9c77, 1);
			progress.strokeRect(x, y, w, h)
			progress.fillStyle(0xcb9c77, 1);
			progress.fillRect(x, y, w * value, h);
		});

		this.load.on('complete', () => {
			progress.destroy();
			this.scene.start('Menu');
		});

		this.load.pack('preload', './assets/pack.json', 'preload');

	}

	create() {
	}
}