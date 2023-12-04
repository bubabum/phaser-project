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
					}
				]
			}
		});
	}

	init() {
		const config = {
			key: 'on',
			frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 9 }),
			frameRate: 15,
			repeat: -1
		};

		this.anims.create(config);
		this.add.sprite(400, 200, 'bomb').play('on');
	}

	preload() {
		const progress = this.add.graphics();

		this.load.on('progress', value => {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, 270, 800 * value, 60);
		});

		this.load.on('complete', () => {
			progress.destroy();
			this.scene.start('Game');
		});

		this.load.pack('preload', './assets/pack.json', 'preload');

	}

	create() {
	}
}