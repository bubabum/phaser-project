export class Menu extends Phaser.Scene {

	constructor() {
		super({
			key: 'Menu',
		});
	}

	preload() {
	}

	create() {
		const { width, height } = this.game.config;
		const progress = this.add.graphics();
		progress.fillStyle(0x56505b, 1);
		progress.fillRect(0, 0, width, height);
		this.add.bitmapText(width * 0.5, 50, 'font', 'Jolly Exploger', 32, 1).setOrigin(0.5, 0.5);
		this.player = this.add.sprite(width * 0.5, 150, 'life').setOrigin(0.5, 0.5).setScale(3);
		this.player.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('bomb_guy', { start: 0, end: 25 }),
			frameRate: 20,
			repeat: -1
		});
		this.player.anims.play('idle');
		this.startGameBtn = this.add.bitmapText(width * 0.5, height * 0.5 + 50, 'font', 'Start game', 20, 1)
			.setOrigin(0.5, 0.5)
			.setInteractive()
			.on('pointerover', () => this.startGameBtn.setScale(1.1))
			.on('pointerout', () => this.startGameBtn.setScale(1))
			.on('pointerdown', () => this.startGame());
		this.add.sprite(100, height * 0.5 + 80, 'arrows');
		this.add.bitmapText(130, height * 0.5 + 71, 'font', 'run', 16, 1);
		this.add.sprite(100, height * 0.5 + 100, 'jump');
		this.add.bitmapText(130, height * 0.5 + 91, 'font', 'jump', 16, 1);
		this.add.sprite(100, height * 0.5 + 120, 'open');
		this.add.bitmapText(130, height * 0.5 + 111, 'font', 'open door', 16, 1);
		this.add.sprite(100, height * 0.5 + 140, 'throw');
		this.add.bitmapText(130, height * 0.5 + 131, 'font', 'throw bomb', 16, 1);
		this.add.sprite(100, height * 0.5 + 160, 'knife');
		this.add.bitmapText(130, height * 0.5 + 151, 'font', 'use knife', 16, 1);
		this.add.sprite(100, height * 0.5 + 180, 'rum');
		this.add.bitmapText(130, height * 0.5 + 171, 'font', 'use rum', 16, 1);
		this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		this.gamepadText = this.add.bitmapText(width * 0.5, height - 20, 'font', 'press gamepad button to connect', 12, 1).setOrigin(0.5, 0.5);
		if (this.input.gamepad.gamepads.length > 0) {
			this.gamepad = this.input.gamepad.gamepads[0];
			this.gamepadText.setText(`${this.gamepad.id} - connected`);
		}
		this.input.gamepad.once('connected', (pad) => {
			this.gamepad = pad;
			this.gamepadText.setText(`${pad.id} - connected`);
		});
	}

	update() {
		if (this.spaceKey.isDown || this.enterKey.isDown) this.startGame();
		if (this.gamepad) this.gamepad.buttons.forEach(button => {
			if ([0, 9].indexOf(button.index) !== -1 && button.pressed) this.startGame();
		})
	}

	startGame() {
		const sound = this.sound.add(`blop`);
		sound.setVolume(0.1).play();
		this.scene.start('Game', {});
	}

}