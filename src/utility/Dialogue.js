export class Dialogue {

	constructor(scene, anchorObject) {
		this.scene = scene;
		this.anchorObject = anchorObject;
		this.isVisible = false;
		this.width = 220;
		this.height = 106;
		this.padding = 10;
		this.box = scene.add.rectangle(0, 0, this.width, this.height, 0x323443, 0.5).setDepth(32).setOrigin(0, 1).setStrokeStyle(2, 0x323443, 1);
		this.text = scene.add.bitmapText(0, 0, 'font', '', 12, 1).setMaxWidth(this.width - this.padding * 2).setOrigin(0, 0).setDepth(33).setDropShadow(1, 1).setLeftAlign();
		this.box.noLight = true;
		this.text.noLight = true;
		this.setPositions();
		this.setIsVisible();
	}

	update() {
		this.setPositions();
	}

	setIsVisible() {
		this.box.setVisible(this.isVisible);
		this.text.setVisible(this.isVisible);
	}

	show(text) {
		if (this.isVisible) return
		this.scene.scene.moveUp('Game');
		this.isVisible = true;
		this.setIsVisible();
		this.text.setText('');
		let buffer = [];
		for (let i = 0; i < text.length; i++) {
			this.scene.time.delayedCall(100 * i, () => {
				buffer.push(text.split('')[i]);
				this.text.setText(buffer.join(''));
				const sound = this.scene.sound.add('text')
				sound.setVolume(0.05).play();
			})
		}
		this.scene.time.delayedCall(100 * text.length + 500, () => {
			this.hide();
		})
	}

	hide() {
		this.scene.scene.moveDown('Game');
		this.isVisible = false;
		this.setIsVisible();
	}


	setPositions() {
		this.getAnchorPoint();
		const { x, y, width } = this.scene.cameras.main.worldView
		let point = { x: this.x, y: this.y }
		if (this.x + this.width > x + width) point.x = x + width - this.width;
		if (this.y - this.height < y) point.y = y + this.height;
		this.box.setPosition(point.x, point.y);
		this.text.setPosition(point.x + this.padding, point.y - this.height + this.padding);
	}

	getAnchorPoint() {
		const { x, width } = this.scene.cameras.main.worldView
		if (this.anchorObject.x > x + width * 0.6) {
			this.x = Math.floor(this.anchorObject.getTopLeft().x);
			this.y = Math.floor(this.anchorObject.getTopLeft().y);
			return
		}
		this.x = Math.floor(this.anchorObject.getTopRight().x);
		this.y = Math.floor(this.anchorObject.getTopRight().y);
	}

}