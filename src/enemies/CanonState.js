import { State } from '../utility/State';

export class CanonIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
		enemy.scene.time.delayedCall(enemy.shootInterval, () => enemy.setState('SHOOT'));
	}
	handleState() {

	}
}

export class CanonShoot extends State {
	constructor(enemy) {
		super({ name: 'SHOOT', enemy, animation: 'shoot' });
	}
	enter() {
		const { enemy } = this;
		enemy.sounds.setVolume('shot', enemy.getVolume() * enemy.maxShotVolume);
		enemy.sounds.play('shot');
		// const sounds = enemy.scene.enemySounds;
		// sounds.getSound('shot').setVolume(enemy.getVolume() * sounds.getMaxVolume('shot')).play();
		enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'shoot', function (anims) {
			enemy.setState('IDLE');
		}, this);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.currentFrame.index === 5 && !enemy.isAtacking) enemy.shoot();
		if (enemy.anims.currentFrame.index !== 5) enemy.isAtacking = false;
	}
}