class Canvas {
	init(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
	}

	resize() {
		this.width = this.canvas.width = window.innerWidth;
		this.height = this.canvas.height = window.innerHeight;
	}

	fill(opacity) {
		let {context} = this;
		context.globalAlpha = opacity;
		context.beginPath();
		context.rect(0, 0, this.width, this.height);
		context.fillStyle = 'white';
		context.fill();
	}
}
export default new Canvas;