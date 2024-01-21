export class MovingSpike extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey, rotation }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.state = 'RAISE';
		this.setDepth(10);
		this.setAngle(rotation);
		this.createAnimations(textureKey);
		this.anims.play('idle_top');
		scene.time.delayedCall(50, () => this.drop())
	}

	drop() {
		this.anims.play('move');
		this.state = 'DROP';
		this.disableBody();
		this.scene.time.delayedCall(250, () => {
			this.anims.play('idle_bottom');
			this.scene.time.delayedCall(2000, () => this.raise())
		})
	}

	raise() {
		this.anims.playReverse('move');
		this.state = 'RAISE';
		this.enableBody();
		this.scene.time.delayedCall(250, () => {
			this.anims.play('idle_top');
			this.enableBody();
			this.scene.time.delayedCall(2000, () => this.drop())

		})
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle_top',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 0 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'move',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 1, end: 4 }),
			frameRate: 20,
			repeat: 0,
		});
		this.anims.create({
			key: 'idle_bottom',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 5, end: 5 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}