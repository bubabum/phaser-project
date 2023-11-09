class MessageBox {
	constructor({ scene, x, y, text }) {
		this.text = scene.add.text(x, y, text, { fontSize: '25px', fontFamily: 'Pixelify Sans', fontStyle: '700', fill: '#000000', });
		this.text.setDepth(31);
	}
}