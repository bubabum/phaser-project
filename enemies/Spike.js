class Spike extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, type }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setDepth(25);
		console.log(type)
		this.setPropertiesByType(type);
		if (scene.hasLight) this.setPipeline('Light2D');
	}

	setPropertiesByType(type) {
		switch (type) {
			case 'bottom':
				this.setSize(60, 4);
				this.setOffset(2, 60);
				break;
			case 'left':
				this.setAngle(90)
				this.setSize(4, 60);
				this.setOffset(0, 2);
				break;
			case 'top':
				this.setAngle(180)
				this.setSize(60, 4);
				this.setOffset(2, 0);
				break;
			case 'right':
				this.setAngle(270);
				this.setSize(4, 60);
				this.setOffset(60, 2);
				break;
		}
	}

}