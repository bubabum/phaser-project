class Player extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.states = [
			new Idle(this),
			new Running(this),
			new Jumping(this),
			new Falling(this),
			new Landing(this),
		];
		this.currentState = this.states[0];
		this.currentState.enter();
	}

	setState(name) {
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		//this.rotation += 0.01;
	}

}