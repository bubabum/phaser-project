class Enemy extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, textureKey) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	setState(name) {
		if (this?.currentState?.name === name) return
		if (this?.currentState?.name === 'DEAD_HIT') return
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
		this.anims.play(this.currentState.animation);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.atackHitbox) {
			const posY = this.body.position.y + this.body.height * 0.5 + this.properties.atackHitboxOffsetY
			if (this.getDirection() === 'right') return this.atackHitbox.setPosition(this.body.position.x + this.body.width, posY)
			this.atackHitbox.setPosition(this.body.position.x, posY)
		}
	}

	canRun() {
		return this.properties.canRun
	}
	canDash() {
		return this.properties.canDash
	}
	canJump() {
		return this.properties.canJump
	}
	canScaryRun() {
		return this.properties.canScaryRun
	}
	canHitBomb() {
		return this.properties.canHitBomb
	}

	getHealth() {
		return this.properties.health
	}

	getSpeedX() {
		return this.properties.speedX
	}

	getVisionRange() {
		return this.properties.visionRange
	}

	getDirection() {
		return this.properties.direction
	}

	toogleDirection() {
		this.setVelocityX(-this.body.velocity.x)
		if (this.getDirection() === 'right') return this.setDirection('left');
		this.setDirection('right');
	}

	setDirection(direction) {
		this.properties.direction = direction;
		if (direction === 'right') return this.setFlipX(false);
		this.setFlipX(true);
	}

	setVelocityXByDirection(direction = this.properties.direction, speed = this.getSpeedX()) {
		if (direction === 'right') return this.setVelocityX(speed).setFlipX(false);
		this.setVelocityX(-speed).setFlipX(true);
	}

	checkAtackRange() {
		return Phaser.Math.Distance.BetweenPoints(player, this) < this.properties.atackRange
	}

	checkDashRange() {
		return Phaser.Math.Distance.BetweenPoints(player, this) < this.properties.visionRange &&
			player.y > this.y - this.height * 0.5 &&
			player.y < this.y + this.height * 0.5
	}

	checkBombRange() {
		if (bombs.getChildren().length === 0) return
		for (let i = 0; i < bombs.getChildren().length; i++) {
			if (Phaser.Math.Distance.BetweenPoints(bombs.getChildren()[i], this) < 50 && bombs.getChildren()[i].x < this.x && this.getDirection() === 'left' ||
				Phaser.Math.Distance.BetweenPoints(bombs.getChildren()[i], this) < 50 && bombs.getChildren()[i].x > this.x && this.getDirection() === 'right') return true
		}
		return false
	}

	moveToBomb() {
		if (bombs.getChildren().length === 0) return
		let bomb = bombs.getChildren().sort((a, b) => Math.abs(a.x - this.x) - Math.abs(b.x - this.x))[0];
		this.scene.physics.moveTo(this, bomb.x, this.y, this.properties.speedX);
		let bombCollider = this.scene.physics.add.overlap(this, bomb, () => {
			if (this.canHitBomb()) this.hitBomb(bomb);
		});
		this.scene.physics.world.removeCollider(bombCollider);
	}

	makeDash() {
		if (this.x > player.x && this.getDirection() === 'right' || this.x < player.x && this.getDirection() === 'left') this.toogleDirection();
		this.setVelocityXByDirection(this.properties.direction, this.properties.dashSpeedX);
		//this.scene.physics.moveTo(this, player.body.position.x, this.y, this.properties.dashSpeedX);
	}

	takeDamage(bomb, collider) {
		if (this.properties.isInvulnerable) return
		this.properties.health--;
		const angle = Phaser.Math.Angle.BetweenPoints(bomb.getCenter(), this.getCenter());
		this.scene.physics.velocityFromRotation(angle, 200, this.body.velocity);
		this.scene.physics.world.removeCollider(collider);
		this.properties.isInvulnerable = true;
		if (this.getHealth() > 0) return this.setState('HIT');
		this.setState('DEAD_HIT');
	}


	createAtackHitbox() {
		this.atackHitbox = this.scene.add.circle(this.x, this.y, this.properties.atackHitboxRadius, 0x646464);
		this.atackHitbox.setVisible(false);
		this.atackHitbox = this.scene.physics.add.existing(this.atackHitbox);
		this.atackHitbox.body.setCircle(this.properties.atackHitboxRadius);
		this.atackHitbox.body.setAllowGravity(false);
		this.scene.physics.add.overlap(this.atackHitbox, player, () => {
			if (this.anims.currentFrame.index === 5 && !this.isAtacking && ['ATACK', 'AIR_ATACK'].includes(this.currentState.name)) {
				const angle = Phaser.Math.Angle.BetweenPoints(this.getCenter(), player.getCenter());
				//this.scene.physics.velocityFromRotation(angle, 200, player.body.velocity);
				player.setState('HIT');
				//player.setVelocity((this.getDirection() === 'right' ? 200 : -200), -200);
				if (player.health === 0) player.scene.scene.restart();
				this.isAtacking = true;
			}
			if (this.anims.currentFrame.index !== 5) this.isAtacking = false;
		});
	}

	canMoveForward() {
		let marginX = 5;
		let isLeftOrientated = false;
		if (this.getDirection() === 'left') isLeftOrientated = true;
		const isNextGroundTileCollidable = (layer, npc) => {
			const { x, y, width, height } = npc.body;
			const posX = x + (isLeftOrientated ? -marginX : width + marginX);
			const tile = layer.getTileAtWorldXY(posX, y + height + 0.5);
			return tile?.collideUp
		}
		const isNextTileCollidable = (layer, npc) => {
			const { x, y, width, height } = npc.body;
			const posX = x + (isLeftOrientated ? -marginX : width + marginX);
			const tile = layer.getTileAtWorldXY(posX, y + height - 0.5);
			if (isLeftOrientated) return tile?.collideRight;
			return tile?.collideLeft;
		}
		const nextPlatformTile = isNextGroundTileCollidable(platformsLayer, this)
		const nextGroundTile = isNextGroundTileCollidable(groundLayer, this)
		const nextTile = isNextTileCollidable(groundLayer, this)
		if (!nextGroundTile || nextTile) return false
		return true
	}

}