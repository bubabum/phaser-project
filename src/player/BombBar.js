export class BombBar extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, player, textureKey }) {
		super(scene, player.body.x, player.body.y - 15, textureKey);
		scene.add.existing(this);
		this.player = player;
		this.setVisible(false);
		this.createAnimations(textureKey);
		this.setDepth(25);
		this.noLight = true;
		//this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x323443, alpha: 1 } });
	}

	update() {
		this.setPosition(this.player.body.center.x, this.player.body.y - 15);
		if (this.light) {
			this.light.x = this.x;
			this.light.y = this.y;
		}
		// this.graphics.clear()
		// if (!this.player.activeBomb) return
		// const angle = 45;
		// const cos = Math.cos((angle * Math.PI) / 180) ** 2;
		// const tan = Math.tan((angle * Math.PI) / 180);
		// const velocity = this.anims.getProgress() * 300;
		// console.log(velocity)
		// for (let i = 0; i < 1500; i += 10) {
		// 	const y = ((i * tan) + ((-280 * i * i) / (2 * velocity ** 2 * cos)));
		// 	if (this.player.y - y > this.player.y + 20) break
		// 	this.graphics.fillCircle(this.player.x + i + 10, this.player.y - y, 1);
		// }
	}

	startCharging() {
		this.setVisible(true);
		this.anims.play('CHARGING');
	}

	stopCharging() {
		this.setVisible(false);
		return this.anims.getProgress();
	}

	isVisible() {
		return this.visible
	}

	createAnimations(textureKey) {
		this.anims.create({
			key: 'CHARGING',
			frames: this.anims.generateFrameNumbers(textureKey, { start: 0, end: 10 }),
			frameRate: 20,
			repeat: 0,
		});
	}

}