class State {
	constructor({ name, player = null, enemy = null, animation }) {
		this.name = name;
		this.player = player;
		this.enemy = enemy;
		this.animation = animation;
	}
}