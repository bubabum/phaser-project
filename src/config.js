import { Loader } from './scenes/Loader';
import { Game } from './scenes/Game';
import { Hud } from './scenes/Hud';

export const GameConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		width: 16 * 52,
		height: 9 * 52,
	},
	input: {
		gamepad: true
	},
	render: { pixelArt: true, antialias: false },
	crisp: true,
	maxLights: 100,
	scene: [Loader, Game, Hud]
};