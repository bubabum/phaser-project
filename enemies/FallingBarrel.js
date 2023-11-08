class FallingBarrel extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setSize(42, 44);
		this.setOffset(11, 16);
		this.setOrigin(0, 0);
		this.getTile()
		this.anims.createFromAseprite(textureKey);
		this.anims.play({ key: 'Idle', repeat: -1 });
		if (scene.hasLight) this.setPipeline('Light2D');
	}

	update() {
		if (this.body.onFloor() && !this.landed) {
			this.brake();
			this.landed = true;
		}
	}

	getTile() {
		const groundLayer = this.scene.groundLayer;
		const tilesToCheck = (this.scene.map.heightInPixels - this.y - this.height) / this.scene.map.tileHeight;
		for (let i = 0; i < tilesToCheck; i++) {
			let tile = groundLayer.getTileAtWorldXY(this.x + 0.5, this.y + this.height + 0.5 + i * 64);
			if (tile?.collideUp) {
				this.checkCollider = this.scene.add.rectangle(this.x, this.y + this.height, this.width, tile.pixelY - this.y - this.height, 0x646464);
				this.checkCollider.setOrigin(0, 0);
				this.checkCollider.setVisible(false);
				this.scene.physics.add.existing(this.checkCollider);
				this.checkCollider.body.setAllowGravity(false);
				this.checkCollider.barrel = this;
				return
			}
		}
	}

	fall() {
		this.checkCollider.destroy();
		this.body.setAllowGravity(true);
		this.setVelocityY(350)
		this.anims.play({ key: 'Fall', repeat: -1 });
	}

	brake() {
		this.anims.play('Brake');
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Brake', function (anims) {
			this.destroy();
		}, this);
	}

}