class Loader extends Phaser.Scene {

	constructor() {
		super({
			key: 'Loader',
			pack: {
				files: [
					{
						type: 'spritesheet',
						key: 'bomb',
						url: 'assets/bomb.png',
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

		const textures = {
			image: ['sword', 'bomb_inventory', 'sword_inventory'],
		}

		for (let key in textures) {
			textures[key].forEach(item => {
				this.load[key](item, `assets/${item}.png`)
			})
		}

		this.load.image('tiles', './assets/tileset.png');
		this.load.tilemapTiledJSON('level0', './assets/level0.json');
		this.load.tilemapTiledJSON('level1', './assets/level1.json');
		this.load.tilemapTiledJSON('level2', './assets/level2.json');

		this.load.spritesheet('bomb_guy', './assets/bomb_guy.png', { frameWidth: 58, frameHeight: 58 });
		this.load.spritesheet('bomb', 'assets/bomb.png', { frameWidth: 96, frameHeight: 108 });

		// this.load.image('sword', 'assets/sword.png');
		// this.load.image('bomb_inventory', 'assets/bomb_inventory.png');
		// this.load.image('sword_inventory', 'assets/sword_inventory.png');
		this.load.image('rum_inventory', 'assets/rum_inventory.png');
		this.load.image('continue_inventory', 'assets/continue_inventory.png');
		this.load.spritesheet('bomb_bar', 'assets/bar.png', { frameWidth: 39, frameHeight: 9 });
		this.load.image('health_bar', 'assets/health_bar.png');
		this.load.spritesheet('rum', 'assets/rum.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('sword_powerup', 'assets/sword_powerup.png', { frameWidth: 32, frameHeight: 32 });
		this.load.image('life_inventory', 'assets/life_inventory.png');
		this.load.image('enemy_health_bar', 'assets/enemy_health_bar.png');
		this.load.image('health', 'assets/health.png');

		this.load.spritesheet('run_particles', 'assets/run_particles.png', { frameWidth: 12, frameHeight: 10 });
		this.load.spritesheet('jump_particles', 'assets/jump_particles.png', { frameWidth: 40, frameHeight: 28 });
		this.load.spritesheet('land_particles', 'assets/land_particles.png', { frameWidth: 80, frameHeight: 10 });
		this.load.spritesheet('life', 'assets/life.png', { frameWidth: 20, frameHeight: 18 });
		this.load.spritesheet('continue', 'assets/continue.png', { frameWidth: 64, frameHeight: 64 });
		this.load.spritesheet('key', 'assets/key.png', { frameWidth: 30, frameHeight: 30 });

		this.load.spritesheet('canon', 'assets/canon.png', { frameWidth: 62, frameHeight: 46 });
		this.load.image('canon_ball', 'assets/canon_ball.png');
		this.load.spritesheet('bald_pirate', 'assets/bald_pirate.png', { frameWidth: 63, frameHeight: 67 });
		this.load.spritesheet('capitan', 'assets/capitan.png', { frameWidth: 80, frameHeight: 72 });
		this.load.spritesheet('cucumber', 'assets/cucumber.png', { frameWidth: 64, frameHeight: 68 });
		this.load.spritesheet('big_guy', 'assets/big_guy.png', { frameWidth: 77, frameHeight: 74 });

		this.load.spritesheet('door', 'assets/door.png', { frameWidth: 78, frameHeight: 96 });
		this.load.image('platform', 'assets/platform.png');

		this.load.spritesheet('candle', 'assets/lighting/candle.png', { frameWidth: 14, frameHeight: 32 });
		this.load.spritesheet('candle_light', 'assets/lighting/candle_light.png', { frameWidth: 60, frameHeight: 58 });
		this.load.image('window', 'assets/lighting/window.png');
		this.load.spritesheet('window_light', 'assets/lighting/window_light.png', { frameWidth: 170, frameHeight: 139 });

		this.load.spritesheet('small_chain', 'assets/small_chain.png', { frameWidth: 9, frameHeight: 52 });
		this.load.spritesheet('big_chain', 'assets/big_chain.png', { frameWidth: 9, frameHeight: 100 });

		this.load.image('barrel', 'assets/decoration/barrel.png');
		this.load.image('blue_bottle', 'assets/decoration/blue_bottle.png');
		this.load.image('chair', 'assets/decoration/chair.png');
		this.load.image('green_bottle', 'assets/decoration/green_bottle.png');
		this.load.image('red_bottle', 'assets/decoration/red_bottle.png');
		this.load.image('table', 'assets/decoration/table.png');
		this.load.image('skull', 'assets/decoration/skull.png');

		this.load.image('spike', 'assets/spikes2.png');


		this.load.image('background_tile0', 'assets/background_tile0.png');
		this.load.image('background_tile1', 'assets/background_tile1.png');
		this.load.image('background_tile2', 'assets/background_tile2.png');
		this.load.image('background_tile3', 'assets/background_tile3.png');
		this.load.image('decoration_tile0', 'assets/decoration_tile0.png');
		this.load.image('decoration_tile1', 'assets/decoration_tile1.png');
		this.load.image('decoration_tile2', 'assets/decoration_tile2.png');
		this.load.image('decoration_tile3', 'assets/decoration_tile3.png');

		this.load.bitmapFont('pixel', 'assets/font/pixel.png', 'assets/font/pixel.xml');

		this.load.aseprite('falling_barrel', 'assets/falling_barrel.png', 'assets/falling_barrel.json');
	}

	create() {
	}
}