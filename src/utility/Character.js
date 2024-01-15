export class Character extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, texture }) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);

	}

	isDead() {
		return this.health === 0
	}

	isAlive() {
		return this.health > 0
	}

	setState(name) {
		if (this.currentState?.name === name) return
		if (this.currentState?.name === 'DEAD_GROUND') return
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
		this.anims.play(this.currentState.animation);
	}

	setTouchingPlatform(platform) {
		this.touchingPlatform = platform;
	}

	setInvulnerability(status, effect = false) {
		this.isInvulnerable = status;
		if (effect === false) {
			if (this.invulnerabilityEffect) this.invulnerabilityEffect.remove();
			this.setAlpha(1);
			return this
		}
		if (status === true) {
			this.invulnerabilityEffect = this.scene.tweens.add({
				targets: this,
				duration: 100,
				ease: 'Linear',
				alpha: {
					getStart: () => 0.2,
					getEnd: () => 1,
				},
				repeat: -1,
			});
		} else {
			this.invulnerabilityEffect.remove();
			this.setAlpha(1);
		}
		return this
	}

	takeDamage(death = false, damage = 1) {
		if (!death && this.isInvulnerable || this.isDead()) return false
		if (this.health === 1 || death === true) {
			this.health = 0;
			this.setState('DEAD_HIT');
			this.setInvulnerability(true);
		} else {
			this.health -= damage;
			this.setState('HIT');
			this.setInvulnerability(true, true);
		}
		if (this.isPlayer()) this.scene.registry.set('playerData', this.getPlayerData(false));
		return true
	}

}