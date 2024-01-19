export class SoundManager {

	constructor(scene, sounds) {
		this.scene = scene;
		this.soundMap = sounds;
		this.sounds = {};
		this.createSounds();
	}

	createSounds() {
		for (let key in this.soundMap) {
			this.sounds[key] = this.scene.sound.add(key);
			this.sounds[key].setVolume(this.soundMap[key]);
		}
	}

	play(key) {
		this.sounds[key].play();
	}

	getSound(key) {
		return this.sounds[key]
	}

	getMaxVolume(key) {
		return this.soundMap[key]
	}

	setVolume(key, volume) {
		this.sounds[key].setVolume(volume);
	}

	isPlaying(key) {
		return this.sounds[key].isPlaying;
	}

}