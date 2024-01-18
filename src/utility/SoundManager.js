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

	isPlaying(key) {
		return this.sounds[key].isPlaying;
	}

}