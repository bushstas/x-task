import {getScrollHeight} from '../../utils';

class Canvas {
	init(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
	}

	resize() {
		this.width = this.canvas.width = document.body.clientWidth;
		this.height = this.canvas.height = getScrollHeight();
	}

	fill(opacity) {
		let {context} = this;
		context.clearRect(0, 0, this.width, this.height);
		context.globalAlpha = opacity;
		context.rect(0, 0, this.width, this.height);
		context.fillStyle = 'white';
		context.fill();
	}

	cut(data) {console.log(2313)
		let {mx, my, width, height} = data;
	    let x = document.body.clientWidth / 2 + mx;
		this.context.clearRect(x, my, width, height);
	}
}
export default new Canvas;