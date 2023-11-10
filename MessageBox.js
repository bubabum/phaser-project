class MessageBox {
	constructor({ scene, x, y, text }) {
		scene.add.sprite(512 - 128, 50, "messagebox").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(30);
		this.text = scene.add.text(x, y, text, { fontSize: '25px', fontFamily: 'Pixelify Sans', fontStyle: '700', fill: '#000000', });
		this.text.setDepth(31);
	}
}