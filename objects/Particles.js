class ParticlesGroup extends Phaser.GameObjects.Group {

	constructor({ scene, textures, emitter }) {
		super(scene);
		scene.add.existing(this);
		this.emitter = emitter;
		this.textures = textures;
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		const type = this.emitter?.currentState?.name;
		const textureKey = this.textures[type.toLowerCase()];
		if (type && textureKey && !this.getChildren().find(item => item.type === type)) return this.add(new Particle({ textureKey, emitter: this.emitter, group: this, type }));
	}

}


class Particle extends Phaser.Physics.Arcade.Sprite {

	constructor({ textureKey, emitter, group, type }) {
		super(emitter.scene, emitter.x, emitter.y, textureKey);
		emitter.scene.add.existing(this);
		this.emitter = emitter;
		this.group = group;
		this.type = type;
		this.setPosition(emitter.getBottomCenter().x, emitter.getBottomCenter().y);
		this.setOrigin(0.5, 1);
		this.setFlipX(emitter.flipX)
		this.createAnimations(textureKey);
		this.anims.play('idle');
		this.destroyHandler(type);
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 5 }),
			frameRate: 20,
			repeat: 0,
		});
	}

	destroyHandler(type) {
		if (type === 'JUMP') {
			this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'idle', () => this.setVisible(false), this);
			this.emitter.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'fall', () => this.destroy(), this.emitter);
		} else {
			this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'idle', function (anims) {
				this.destroy();
			}, this);
		}

	}

}