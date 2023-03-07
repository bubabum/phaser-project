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
			if (this.getDirection() === 'right') return this.atackHitbox.setPosition(this.body.position.x + this.body.width, this.body.position.y + 30)
			this.atackHitbox.setPosition(this.body.position.x, this.body.position.y + 30)
		}
	}

	canRun() {
		return this.properties.canRun
	}
	canDash() {
		return this.properties.canDash
	}
	canScaryRun() {
		return this.properties.canScaryRun
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

	createAtackOverlap() {
		// let playerCollider = this.scene.physics.add.overlap(this.atackHitbox, player, () => {
		// 	if (this.anims.currentFrame.index === 5) {
		// 		console.log('hit')
		// 		this.body.setEnable(false)
		// 	}
		// 	if (this.anims.currentFrame.index !== 5) this.body.setEnable(true)
		// 	// player.setState('HIT');
		// 	// const angle = Phaser.Math.Angle.BetweenPoints(this.getCenter(), player.getCenter());
		// 	// this.atackHitbox.body.enable = false;
		// 	// this.scene.physics.velocityFromRotation(angle, 200, player.body.velocity);
		// 	// this.scene.physics.world.removeCollider(playerCollider);
		// });
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