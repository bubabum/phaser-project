class Idle extends State {
	constructor(player) {
		super({ name: 'IDLE', player, animation: 'idle' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp, keyM }) {
		const { player } = this;
		if (cursors.right.isDown || cursors.left.isDown) player.setState('RUN');
		if (Phaser.Input.Keyboard.JustDown(keyUp)) player.setState('JUMP');
		if (Phaser.Input.Keyboard.JustDown(keyM)) player.setState('DASH');
	}
}

class Run extends State {
	constructor(player) {
		super({ name: 'RUN', player, animation: 'run' });
	}
	enter() {
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(player.velocity);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-player.velocity);
		} else {
			player.setVelocityX(0);
			player.setState('IDLE');
		}
		if (Phaser.Input.Keyboard.JustDown(keyUp)) player.setState('JUMP');
		if (player.body.velocity.y > 0 && !player.touchingPlatform || !player.body.onFloor()) {
			player.setState('FALL');
			player.jumpGap = true;
			player.scene.time.delayedCall(100, () => player.jumpGap = false);
		}
	}
}
class Dash extends State {
	constructor(player) {
		super({ name: 'DASH', player, animation: 'run' });
	}
	enter() {
		const { player } = this;
		player.setVelocity(player.velocity * 2.5, 0);
		player.body.setAllowGravity(false);
		player.scene.time.delayedCall(200, () => {
			player.body.setAllowGravity(true);
			player.setVelocityX(0);
			player.setState('IDLE');
		});
	}
	handleInput({ cursors, keyM }) {

	}
}

class Jump extends State {
	constructor(player) {
		super({ name: 'JUMP', player, animation: 'jump' });
	}
	enter() {
		const { player } = this;
		player.setVelocityY(player.jumpVelocity);
		player.touchingPlatform = null;
		player.scene.time.delayedCall(100, () => player.landGap = true);
	}
	handleInput({ cursors, keyM }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(player.velocity);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-player.velocity);
		} else {
			player.setVelocityX(0);
		}
		if (player.body.velocity.y > 0) player.setState('FALL');
		if (player.body.onFloor() && player.landGap) player.setState('LAND');
		if (Phaser.Input.Keyboard.JustDown(keyM)) player.setState('DASH');
	}
}

class Fall extends State {
	constructor(player) {
		super({ name: 'FALL', player, animation: 'fall' });
	}
	enter() {
		const { player } = this;
		player.setVelocityY(0);
		player.touchingPlatform = null;
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (cursors.right.isDown) {
			player.setVelocityX(player.velocity);
		} else if (cursors.left.isDown) {
			player.setVelocityX(-player.velocity);
		} else {
			player.setVelocityX(0);
		}
		if (player.hasActiveRum && Phaser.Input.Keyboard.JustDown(keyUp) && !player.madeDoubleJump) {
			player.setState('JUMP');
			player.madeDoubleJump = true;
			return
		}
		if (player.jumpGap && Phaser.Input.Keyboard.JustDown(keyUp)) {
			player.setState('JUMP');
			player.jumpGap = false;
			return
		}
		if (player.body.blocked.down) return player.setState('LAND');
	}
}

class Land extends State {
	constructor(player) {
		super({ name: 'LAND', player, animation: 'land' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
		player.madeDoubleJump = false;
		player.landGap = false;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'land', function (anims) {
			player.setState('IDLE');
		}, this);
	}
	handleInput({ cursors, keyUp }) {
		const { player } = this;
		if (Phaser.Input.Keyboard.JustDown(keyUp)) return player.setState('JUMP');
		if (cursors.right.isDown || cursors.left.isDown) return player.setState('RUN');
	}
}

class Hit extends State {
	constructor(player) {
		super({ name: 'HIT', player, animation: 'hit' });
	}
	enter() {
		const { player } = this;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'hit', function (anims) {
			player.setState('FALL');
			player.scene.time.delayedCall(2000, () => player.setInvulnerability(false));
		}, this);
	}
	handleInput() {

	}
}

class DeadHit extends State {
	constructor(player) {
		super({ name: 'DEAD_HIT', player, animation: 'dead_hit' });
	}
	enter() {
	}
	handleInput() {
		const { player } = this;
		if (player.body.velocity.y === 0) player.setState('DEAD_GROUND');
	}
}

class DeadGround extends State {
	constructor(player) {
		super({ name: 'DEAD_GROUND', player, animation: 'dead_ground' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
		player.scene.time.delayedCall(3000, () => {
			player.continue--;
			if (player.continue < 0) alert('GAME OVER')
			const lives = [...player.collected.lives].map(id => id.charAt(0) !== player.scene.currentLevel);
			player.collected.lives = new Set([...lives]);
			player.scene.scene.restart({ level: player.scene.currentLevel, playerData: player.getPlayerData() })
		});
	}
	handleInput() {
	}
}

class DoorIn extends State {
	constructor(player) {
		super({ name: 'DOOR_IN', player, animation: 'door_in' });
	}
	enter() {
		const { player } = this;
		player.setVelocityX(0);
	}
	handleInput() {
	}
}

class DoorOut extends State {
	constructor(player) {
		super({ name: 'DOOR_OUT', player, animation: 'door_out' });
	}
	enter() {
		const { player } = this;
		player.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'door_out', function (anims) {
			player.setState('IDLE');
		}, this);
	}
	handleInput() {
	}
}