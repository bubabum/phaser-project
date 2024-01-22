export class Controller {

	constructor(scene) {
		this.scene = scene;
		const { width, height } = scene.game.config;
		this.leftPad = { x: 92, y: height - 120 };
		this.rightPad = { x: width - 92, y: height - 120 };
		this.buttons = {
			moveLeft: {
				gamepadKey: 14,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
				touchKey: scene.add.sprite(this.leftPad.x - 40, this.leftPad.y, 'left').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			moveRight: {
				gamepadKey: 15,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
				touchKey: scene.add.sprite(this.leftPad.x + 40, this.leftPad.y, 'right').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			openDoor: {
				gamepadKey: 13,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
				touchKey: scene.add.sprite(this.leftPad.x, this.leftPad.y + 40, 'down').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			jump: {
				gamepadKey: 0,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
				touchKey: scene.add.sprite(this.rightPad.x, this.rightPad.y + 48, 'a').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useBomb: {
				gamepadKey: 2,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
				touchKey: scene.add.sprite(this.rightPad.x - 48, this.rightPad.y, 'x').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useSword: {
				gamepadKey: 1,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
				touchKey: scene.add.sprite(this.rightPad.x + 48, this.rightPad.y, 'b').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useRum: {
				gamepadKey: 3,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
				touchKey: scene.add.sprite(this.rightPad.x, this.rightPad.y - 48, 'y').setDepth(40).setScrollFactor(0, 0).setScale(3).setVisible(false),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			}
		}
		if (window.navigator.maxTouchPoints > 0) this.setTouchKeys();
	}

	setTouchKeys() {
		for (let key in this.buttons) {
			this.buttons[key].touchKey.setVisible(true).setInteractive();
			this.buttons[key].touchKey.on('pointerdown', () => {
				this.buttons[key].touched = true;
			});
			this.buttons[key].touchKey.on('pointerout', () => {
				this.buttons[key].touched = false;
			});
			this.buttons[key].touchKey.on('pointerup', () => {
				this.buttons[key].touched = false;
			});
		}
	}

	update() {
		if (this.scene.player.disabledInput) return
		const gamepad = this.scene.input?.gamepad.getPad(0);
		for (let key in this.buttons) {
			const button = this.buttons[key];
			button.isPressed = gamepad?.buttons[button.gamepadKey].pressed || button.keyboardKey.isDown || button.touched;
			if (key === 'moveRight' && gamepad?.axes[0].value > 0.2) button.isPressed = true;
			if (key === 'moveLeft' && gamepad?.axes[0].value < -0.2) button.isPressed = true;
			if (button.isPressed && !button.lastPressed) {
				button.justDown = true;
			} else {
				button.justDown = false;
			}
			if (!button.isPressed && button.lastPressed) {
				button.justUp = true;
			} else {
				button.justUp = false;
			}
			button.lastPressed = button.isPressed;
		}
	}

}