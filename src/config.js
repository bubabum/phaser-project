import { Loader } from './scenes/Loader';
import { Game } from './scenes/Game';
import { Hud } from './scenes/Hud';
import { Menu } from './scenes/Menu';
import { GameOver } from './scenes/GameOver';

export const GameConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		width: ((window.screen.width / window.screen.height) < 1 ? 9 / (window.screen.width / window.screen.height) * 52 : 16 * 52),
		height: ((window.screen.width / window.screen.height) < 1 ? 9 * 52 : 16 / (window.screen.width / window.screen.height) * 52),
	},
	input: {
		gamepad: true,
		activePointers: 4,
	},
	render: { pixelArt: true, antialias: false },
	crisp: true,
	maxLights: 100,
	scene: [Loader, Game, Hud, Menu, GameOver]
};