export class Controller {

	constructor(scene) {
		this.scene = scene;
		this.buttons = {
			moveLeft: {
				gamepadKey: 14,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			moveRight: {
				gamepadKey: 15,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
				lastPressed: false,
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			openDoor: {
				gamepadKey: 13,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			jump: {
				gamepadKey: 0,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useBomb: {
				gamepadKey: 2,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useSword: {
				gamepadKey: 1,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			},
			useRum: {
				gamepadKey: 3,
				keyboardKey: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
				lastPressed: false,
				isPressed: false,
				justDown: false,
				justUp: false,
			}
		}
	}

	update() {
		const gamepad = this.scene.input?.gamepad.getPad(0);
		for (let key in this.buttons) {
			const button = this.buttons[key];
			button.isPressed = gamepad?.buttons[button.gamepadKey].pressed || button.keyboardKey.isDown;
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