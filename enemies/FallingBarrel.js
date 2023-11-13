class FallingBarrel extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.scene = scene;
		this.setSize(42, 44);
		this.setOffset(11, 16);
		this.setOrigin(0, 0);
		this.createCollider();
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

	createCollider() {
		const { groundLayer, platformsLayer } = this.scene;
		const { x, y, width, height } = this;
		const { heightInPixels, tileHeight } = this.scene.map;
		const tilesToCheck = (heightInPixels - y - height) / tileHeight;
		for (let i = 0; i < tilesToCheck; i++) {
			const groundTile = groundLayer.getTileAtWorldXY(x + 0.5, y + height + 0.5 + i * 64);
			const platformTile = platformsLayer.getTileAtWorldXY(x + 0.5, y + height + 0.5 + i * 64);
			if (groundTile?.collideUp || platformTile?.collideUp) {
				let tileY = groundTile.pixelY;
				if (platformTile?.collideUp) tileY = platformTile.pixelY;
				this.checkCollider = this.scene.add.rectangle(x, y + height, width, tileY - y - height, 0x646464);
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
		this.setVelocityY(350);
		this.setSize(42, 42);
		this.anims.play({ key: 'Fall', repeat: -1 });
	}

	brake() {
		this.anims.play('Brake');
		this.body.destroy();
		this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'Brake', function (anims) {
			this.destroy();
		}, this);
	}

}