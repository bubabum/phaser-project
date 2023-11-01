class ParticlesGroup extends Phaser.GameObjects.Group {

	constructor({ scene, types, textureKey, emitter }) {
		console.log(scene)
		super(scene);
		scene.add.existing(this);
		this.emitter = emitter;
		this.types = types;
		this.textureKey = textureKey;
	}
	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		const type = this.emitter?.currentState?.name;
		if (!type) return
		if (this.types.includes(type) && this.getChildren().length === 0) {
			const particle = new Particle({ textureKey: this.textureKey, emitter: this.emitter, group: this, type });
			this.add(particle);
		}
	}

}


class Particle extends Phaser.Physics.Arcade.Sprite {

	constructor({ textureKey, emitter, group, type }) {
		super(emitter.scene, emitter.x, emitter.y - 100, textureKey);
		emitter.scene.add.existing(this);
		this.emitter = emitter;
		this.group = group;
		this.setOrigin(1, 1);
		this.createAnimations(textureKey);
		this.anims.play('idle');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'idle', function (anims) {
			//this.group.clear(true, true);
			this.destroy();
		}, this);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 5 }),
			frameRate: 20,
			repeat: 0,
		});
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

	}

}