class EnemyIdle extends State {
	constructor(carrier) {
		super('IDLE', carrier);
	}
	enter() {
		this.carrier.setVelocityX(0);
	}
	handleState() {
		this.carrier.setState('RUNNING');
	}
}

class EnemyRunning extends State {
	constructor(carrier) {
		super('RUNNING', carrier);
	}
	enter() {
		this.carrier.setVelocityX(this.carrier.getSpeedX());
	}
	handleState() {
		if (this.carrier.checkAtackRange()) return this.carrier.setState('ATACK');
		if (this.carrier.canDash() && this.carrier.checkDashRange() && !this.carrier.canMoveForward()) return this.carrier.setState('ATACK');
		if (this.carrier.checkDashRange()) {
			this.carrier.makeDash();
		} else {
			this.carrier.setVelocityXByDirection();
		}
		if (!this.carrier.canMoveForward()) this.carrier.toogleDirection();
	}
}

class EnemyFalling extends State {
	constructor(carrier) {
		super('FALLING', carrier);
	}
	enter() {
	}
	handleState() {
		if (this.carrier.body.blocked.down) this.carrier.setState('RUNNING');
	}
}

class EnemyAtack extends State {
	constructor(carrier) {
		super('ATACK', carrier);
	}
	enter() {
		this.carrier.setVelocityX(0);
	}
	handleState() {
		if (!this.carrier.checkAtackRange() && !this.carrier.canDash() ||
			!this.carrier.checkAtackRange() && this.carrier.canDash() && this.carrier.canMoveForward()) return this.carrier.setState('RUNNING');
		if (!this.carrier.checkDashRange() && this.carrier.canDash()) return this.carrier.setState('RUNNING');
		//if (!this.carrier.checkAtackRange() && this.carrier.properties.canDash && this.carrier.canMoveForward()) this.carrier.setState('RUNNING');
		//if (this.carrier.properties.canDash && !this.carrier.canMoveForward() && !this.carrier.checkDashRange()) this.carrier.setState('RUNNING');
	}
}

class EnemyHit extends State {
	constructor(carrier) {
		super('HIT', carrier);
	}
	enter() {
		setTimeout(() => this.carrier.setState('FALLING'), 300);
		setTimeout(() => this.carrier.properties.isInvulnerable = false, 1000);
	}
	handleState() {
	}
}

class EnemyDeadHit extends State {
	constructor(carrier) {
		super('DEAD_HIT', carrier);
	}
	enter() {
		this.carrier.setSize(30, 50);
		this.carrier.setDrag(100, 0);
		this.carrier.atackHitbox.destroy();
		setTimeout(() => this.carrier.destroy(), 2000);
	}
	handleState() {
	}
}