export class Spike extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, type }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		//this.setOrigin(1, 1)
		this.setDepth(10);
		this.setPropertiesByType(type);
	}

	setPropertiesByType(type) {
		switch (type) {
			case 'bottom':
				this.setSize(58, 12);
				this.setOffset(6, 52);
				break;
			case 'left':
				this.setAngle(90)
				this.setSize(12, 58);
				this.setOffset(0, 6);
				break;
			case 'top':
				this.setAngle(180)
				this.setSize(58, 12);
				this.setOffset(6, 0);
				break;
			case 'right':
				this.setAngle(270);
				this.setSize(12, 58);
				this.setOffset(52, 6);
				break;
		}
	}

}