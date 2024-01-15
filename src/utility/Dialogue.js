export class Dialogue {

	constructor(scene, anchorObject) {
		this.scene = scene;
		this.anchorObject = anchorObject;
		this.isVisible = false;
		this.width = 220;
		this.height = 106;
		this.padding = 10;
		this.box = scene.add.rectangle(0, 0, this.width, this.height, 0x323443, 0.5).setDepth(31).setOrigin(0, 1).setStrokeStyle(2, 0x323443, 1);
		this.text = scene.add.bitmapText(0, 0, 'font', '', 12, 1).setMaxWidth(this.width - this.padding * 2).setOrigin(0, 0).setDepth(32).setDropShadow(1, 1).setLeftAlign();
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
		this.isVisible = true;
		this.setIsVisible();
		this.text.setText('');
		let buffer = [];
		for (let i = 0; i < text.length; i++) {
			this.scene.time.delayedCall(100 * i, () => {
				buffer.push(text.split('')[i]);
				this.text.setText(buffer.join(''));
			})
		}
		this.scene.time.delayedCall(100 * text.length + 500, () => {
			this.hide();
		})
	}

	hide() {
		this.isVisible = false;
		this.setIsVisible();
	}


	setPositions() {
		this.getAnchorPoint();
		this.box.setPosition(this.x, this.y);
		this.text.setPosition(this.x + this.padding, this.y - this.height + this.padding);
	}

	getAnchorPoint() {
		this.x = Math.floor(this.anchorObject.getTopRight().x);
		this.y = Math.floor(this.anchorObject.getTopRight().y);
	}

}