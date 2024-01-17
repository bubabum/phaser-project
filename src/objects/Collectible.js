export class Collectible extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, type }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.id = `${scene.currentLevel}${Math.floor(x)}${Math.floor(y)}${type}`;
		this.type = type;
		this.setDepth(25);
		this.createAnimations(textureKey);
		this.anims.play('idle');
		if (scene.hasLight) this.setPipeline('Light2D');
	}

	disappear() {
		this.disableBody();
		this.anims.play('effect');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'effect', function (anims) {
			this.destroy();
		}, this);
	}

}