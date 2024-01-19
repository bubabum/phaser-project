import { SoundManager } from '../utility/SoundManager';

export class Sword extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.soundMap = {
			//'explosion': 0.5,
			'sword_embedded': 0.2,
		};
		this.sounds = new SoundManager(scene, this.soundMap);
		this.setDepth(25);
		this.createAnimations(textureKey);
		if (scene.hasLight) this.setPipeline('Light2D')
	}

	throw(player) {
		this.anims.play('idle');
		this.setPosition(player.x + (player.flipX ? -10 : 10), player.y);
		this.setVelocityX((player.flipX ? -1 : 1) * 500);
		this.setFlipX(player.flipX);
	}

	embed() {
		this.anims.play('embedded');
		if (this.scene.cameras.main.worldView.contains(this.x, this.y)) this.sounds.play('sword_embedded');
		this.scene.time.delayedCall(3000, () => {
			this.destroy();
		});
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 3 }),
			frameRate: 20,
			repeat: -1,
		});
		this.anims.create({
			key: 'embedded',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 4, end: 7 }),
			frameRate: 10,
			repeat: 0,
		});

	}

}