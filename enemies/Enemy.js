class Enemy extends Phaser.Physics.Arcade.Sprite {

	constructor({ scene, x, y, textureKey }) {
		super(scene, x, y, textureKey);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.player = scene.player;
		this.hitFrame = 5;
		this.canHit = false;
		//this.enemyHurtboxGroup = scene.enemyHurtboxGroup;
		this.canonBallGroup = scene.canonBallGroup;
		this.bombGroup = this.player.bombGroup;
		this.bombToInteract = null;
		this.jumpVelocity = -250;
		this.setDepth(24);
		this.particles = new ParticlesGroup({
			scene: this.scene,
			textures: {
				run: 'run_particles',
				jump: 'jump_particles',
				land: 'land_particles',
			},
			emitter: this,
		});
	}

	setState(name) {
		if (this?.currentState?.name === name) return
		if (this?.currentState?.name === 'DEAD_GROUND') return
		this.currentState = this.states.find(state => state.name === name);
		this.currentState.enter();
		this.anims.play(this.currentState.animation);
	}

	update() {
		this.drawHealthBar();
		if (this.touchingPlatform && this.currentState.name !== 'JUMP' && this.currentState.name !== 'FALL') {
			const platformVelocityY = this.touchingPlatform.body.velocity.y;
			if (platformVelocityY > 0) this.setVelocityY(platformVelocityY);
		}
		this.currentState.handleState();
		// if (this.stateName) this.stateName.destroy();
		// this.stateName = this.scene.add.text(this.x, this.y - 70, `${this.currentState.name}`, { font: '16px Courier', fill: '#ffffff' });
		// this.stateName.x -= this.stateName.width * 0.5;
		if (this?.hurtbox?.body) {
			const posY = this.body.position.y + this.body.height * 0.5 + this.hurtboxOffsetY;
			if (this.direction === 'right') return this.hurtbox.setPosition(this.body.position.x + this.body.width, posY);
			this.hurtbox.setPosition(this.body.position.x, posY);
		}
	}

	drawHealthBar() {
		if (this instanceof Canon) return
		if (this.healthBar || this.health === 0) {
			this.healthBar.destroy();
			this.healthImage.destroy();
		}
		if (this.health === 0) return
		const width = 43;
		const x = Math.floor(this.x)
		const y = Math.floor(this.y);
		this.healthBar = this.scene.add.image(x, y - 50, 'enemy_health_bar');
		this.healthImage = this.scene.add.image(x - 15, y - 50, 'health').setOrigin(0, 0.5);
		this.healthImage.displayWidth = width * this.health / this.maxHealth;
		this.healthBar.setDepth(25);
		this.healthImage.setDepth(26);
	}

	setBodyProperties(direction) {
		const { width, height, offsetX, offsetY } = this.bodyProperties;
		this.setSize(width, height);
		this.setOffset(offsetX, offsetY);
		this.setDirection(direction);
	}

	toogleDirection() {
		this.setVelocityX(-this.body.velocity.x);
		if (this.direction === 'right') return this.setDirection('left');
		this.setDirection('right');
	}

	setDirection(direction) {
		this.direction = direction;
		const { offsetX, flipOffsetX, offsetY } = this.bodyProperties;
		if (direction === 'right') return this.setFlipX(false).setOffset(offsetX, offsetY);
		this.setFlipX(true).setOffset(flipOffsetX, offsetY);
	}

	setVelocityXByDirection(speed = this.speedX, direction = this.direction) {
		if (direction === 'right') return this.setVelocityX(speed).setFlipX(false);
		this.setVelocityX(-speed).setFlipX(true);
	}

	setTouchingPlatform(platform) {
		this.touchingPlatform = platform;
	}

	checkDirectionToPlayer() {
		if (this.direction === 'left' && this.player.x < this.x || this.direction === 'right' && this.player.x > this.x) return true
	}

	turnToPlayer() {
		if (this.direction === 'right' && this.player.x < this.x) return this.setDirection('left')
		if (this.direction === 'left' && this.player.x > this.x) return this.setDirection('right')
	}

	checkAtackRange() {
		return Phaser.Math.Distance.BetweenPoints(this.player, this) < this.atackRange &&
			this.player.y > this.y - this.height * 0.5 &&
			this.player.y < this.y + this.height * 0.5 &&
			this.player.health > 0 &&
			!this.player.isInvulnerable
	}

	checkAtackFrame() {
		return this.anims.currentFrame.index === this.hitFrame;
	}

	atack() {
		this.canHit = true;
	}

	completeAtack() {
		this.canHit = false;
	}

	checkVisionRange() {
		return Phaser.Math.Distance.BetweenPoints(this.player, this) < this.visionRange &&
			this.player.y > this.y - this.height * 0.5 &&
			this.player.y < this.y + this.height * 0.5 &&
			!this.player.isInvulnerable
	}

	checkMoveToPlayer() {
		const tileSize = this.scene.tileset.tileWidth;
		const { x, y } = this.player;
		const range = { x: 2 * tileSize, y: 1 * tileSize };
		let { left, right, bottom, top } = this.getCurrentTile();
		left -= range.x;
		right += range.x;
		bottom += range.y;
		top -= range.y;
		return x > left && x < right && y > top && y < bottom && !this.player.isInvulnerable
	}

	checkClimbUp() {
		const tileSize = this.scene.tileset.tileWidth;
		const { x, y } = this;
		const margin = (this.direction === 'right' ? tileSize : -tileSize);
		const tile = this.scene.groundLayer.getTileAtWorldXY(x + margin, y);
		return tile?.collideRight || tile?.collideLeft;
	}

	getTile(x, y) {
		const { tileHeight, tileWidth } = this.scene.tileset;
		const left = Math.floor(x / tileWidth) * tileWidth;
		const right = Math.ceil(x / tileWidth) * tileWidth;
		const bottom = Math.ceil(y / tileHeight) * tileHeight;
		const top = Math.floor(y / tileHeight) * tileHeight;
		return { left, right, bottom, top }
	}

	getCurrentTile() {
		const { x, y } = this;
		return this.getTile(x, y)
	}

	getTileByOffset(offsetX, offsetY) {
		const { tileHeight, tileWidth } = this.scene.tileset;
		offsetX = (this.direction === 'right' ? offsetX : -offsetX);
		let { x, y } = this;
		x += offsetX * tileWidth;
		y += offsetY * tileHeight;
		return this.getTile(x, y)
	}

	checkPlayerOnTile(offsetX, offsetY) {
		const { x, y } = this.player;
		const { left, right, bottom, top } = this.getTileByOffset(offsetX, offsetY);
		return x > left && x < right && y > top && y < bottom
	}

	checkBombRange() {
		if (this.bombGroup.getChildren().length === 0) return
		for (let i = 0; i < this.bombGroup.getChildren().length; i++) {
			const bomb = this.bombGroup.getChildren()[i];
			if (bomb.isOff || bomb.exploded) continue
			if (this instanceof Cucumber && bomb.body.velocity.x !== 0) continue
			if (Phaser.Math.Distance.BetweenPoints(bomb, this) < 50 && bomb.x < this.x && this.direction === 'left' ||
				Phaser.Math.Distance.BetweenPoints(bomb, this) < 50 && bomb.x > this.x && this.direction === 'right') return true
		}
		return false
	}

	moveToBomb() {
		if (this.bombGroup.getChildren().length === 0) return
		const bomb = this.bombGroup.getChildren().filter(item => item.isOff === false).filter(item => item.exploded === false).sort((a, b) => Math.abs(a.x - this.x) - Math.abs(b.x - this.x))[0];
		if (!bomb) return
		this.bombToInteract = bomb;
		this.scene.physics.moveTo(this, this.bombToInteract.x, this.y, this.speedX);
		const collider = this.scene.physics.add.overlap(this, this.bombToInteract, () => {
			if (this.canInteractWithBomb) this.setState('INTERACT_WITH_BOMB');
			this.scene.physics.world.removeCollider(collider);
		});
	}

	makeDash() {
		if (this.x > this.player.x && this.direction === 'right' || this.x < this.player.x && this.direction === 'left') this.toogleDirection();
		this.setVelocityXByDirection(this.dashSpeedX);
	}

	setInvulnerability(status, effect = false) {
		this.isInvulnerable = status;
		if (effect === false) {
			if (this.invulnerabilityEffect) this.invulnerabilityEffect.remove();
			this.setAlpha(1);
			return this
		}
		if (status === true) {
			this.invulnerabilityEffect = this.scene.tweens.add({
				targets: this,
				duration: 100,
				ease: 'Linear',
				alpha: {
					getStart: () => 0.2,
					getEnd: () => 1,
				},
				repeat: -1,
			});
		} else {
			this.invulnerabilityEffect.remove();
			this.setAlpha(1);
		}
		return this
	}

	takeDamage() {
		// if (this.isInvulnerable) return
		// if (this.health === 1) return this.setState('DEAD_HIT');
		// this.setState('HIT');

		if (this.isInvulnerable) return
		if (this.health === 1) {
			this.setState('DEAD_HIT');
			this.setInvulnerability(true);
		} else {
			this.setState('HIT');
			this.setInvulnerability(true, true);
		}
		this.health--;
	}

	createHurtbox() {
		this.hurtbox = this.scene.add.circle(this.x, this.y, this.hurtboxRadius, 0x646464);
		this.hurtbox.setVisible(false);
		this.scene.physics.add.existing(this.hurtbox);
		this.hurtbox.body.setCircle(this.hurtboxRadius);
		this.hurtbox.body.setAllowGravity(false);
		this.hurtbox.enemy = this;
	}

	isOnPlatform() {
		const isGroundTilePlatform = (layer, npc) => {
			const { x, y, width, height } = npc.body;
			const tile = layer.getTileAtWorldXY(x + width * 0.5, y + height + 0.5);
			return tile?.collideUp
		}
		return isGroundTilePlatform(this.scene.platformsLayer, this)
	}

	canRun() {
		const { x, y, width, height } = this.body;
		const tileSize = this.scene.tileset.tileWidth;
		const groundLayer = this.scene.groundLayer;
		const platformsLayer = this.scene.platformsLayer;
		const rightTile = groundLayer.getTileAtWorldXY(x + width * 0.5 + tileSize, y + height * 0.5);
		const leftTile = groundLayer.getTileAtWorldXY(x + width * 0.5 - tileSize, y + height * 0.5);
		const rightGroundTile = groundLayer.getTileAtWorldXY(x + width * 0.5 + tileSize, y + height + 0.5);
		const leftGroundTile = groundLayer.getTileAtWorldXY(x + width * 0.5 - tileSize, y + height + 0.5);
		const rightPlatformTile = platformsLayer.getTileAtWorldXY(x + width * 0.5 + tileSize, y + height + 0.5);
		const leftPlatformTile = platformsLayer.getTileAtWorldXY(x + width * 0.5 - tileSize, y + height + 0.5);
		if (!rightGroundTile?.collideUp && leftTile?.collideRight || !leftGroundTile?.collideUp && rightTile?.collideLeft) return false
		return rightGroundTile?.collideUp || leftGroundTile?.collideUp || rightPlatformTile?.collideUp || leftPlatformTile?.collideUp
	}

	canMoveForward() {
		const marginX = 5;
		let isLeftOrientated = false;
		if (this.direction === 'left') isLeftOrientated = true;
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
			return tile?.collideLeft
		}
		const nextPlatformTile = isNextGroundTileCollidable(this.scene.platformsLayer, this)
		const nextGroundTile = isNextGroundTileCollidable(this.scene.groundLayer, this)
		const nextTile = isNextTileCollidable(this.scene.groundLayer, this)
		if (!nextGroundTile && !nextPlatformTile || nextTile) return false
		return true
	}

}