import { State } from '../utility/State';

export class CucumberIdle extends State {
	constructor(enemy) {
		super({ name: 'IDLE', enemy, animation: 'idle' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityX(0);
	}
	handleState() {
		const { enemy } = this;
		enemy.turnToPlayer();
		if (enemy.canRun()) return enemy.setState('RUN');
		if (enemy.checkThrowRange() && enemy.canShoot) return enemy.setState('SHOOT');
		//if (enemy.checkVisionRange()) return this.enemy.setState('DASH');
	}
}

export class CucumberRun extends State {
	constructor(enemy) {
		super({ name: 'RUN', enemy, animation: 'run' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocityXByDirection();
	}
	handleState() {
		const { enemy } = this;
		if (!enemy.canRun()) return enemy.setState('IDLE');
		if (enemy.checkThrowRange() && enemy.canShoot) return enemy.setState('SHOOT');
		if (enemy.checkVisionRange() && enemy.checkDirectionToPlayer()) return this.enemy.setState('DASH');
		if (enemy.checkBombRange()) return enemy.setState('MOVE_TO_BOMB');
		if (!enemy.canMoveForward()) enemy.toogleDirection();
		if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection();
	}
}

export class CucumberDash extends State {
	constructor(enemy) {
		super({ name: 'DASH', enemy, animation: 'dash' });
	}
	enter() {
		const { enemy } = this;
		enemy.makeDash();
	}
	handleState() {
		const { enemy } = this;
		if (enemy.checkAtackRange()) return this.enemy.setState('ATACK');
		if (!enemy.checkVisionRange() || !enemy.checkDirectionToPlayer()) return enemy.setState('RUN');
		if (!enemy.canMoveForward()) enemy.toogleDirection();
		if (enemy.body.velocity.x === 0) enemy.setVelocityXByDirection(this.enemy.dashSpeedX);
	}
}

export class CucumberShoot extends State {
	constructor(enemy) {
		super({ name: 'SHOOT', enemy, animation: 'blow_the_wick' });
	}
	enter() {
		const { enemy } = this;
		enemy.turnToPlayer();
		enemy.setVelocityX(0);
		enemy.scene.enemySounds.play('enemy_atack');
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.currentFrame.index === 7 && enemy.canShoot) enemy.shootSeed();
		if (enemy.anims.getProgress() === 1 && enemy.isAlive()) enemy.setState('IDLE');
	}
}

export class CucumberBlowTheWick extends State {
	constructor(enemy) {
		super({ name: 'INTERACT_WITH_BOMB', enemy, animation: 'blow_the_wick' });
	}
	enter() {
		const { enemy } = this;
		enemy.setVelocity(0);
	}
	handleState() {
		const { enemy } = this;
		if (enemy.anims.currentFrame.index > 4 && enemy.bombToInteract) enemy.interactWithBomb();
		if (enemy.anims.getProgress() === 1 && enemy.isAlive()) enemy.setState('IDLE');
	}
}