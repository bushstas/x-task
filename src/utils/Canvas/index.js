import {getScrollHeight, getScrollTop} from '../../utils';

export default class Canvas {
	sx = 0;
	sy = 0;

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

	cut(data) {
		let {mx, my, width, height, fixed} = data;
	    let x = document.body.clientWidth / 2 + mx;
	    let y = my + (fixed ? getScrollTop() : 0);
		this.context.clearRect(x, y, width, height);
	}

	set({size, color}) {
		this.size = size;
		this.color = color;
	}

	start({nativeEvent: {offsetX, offsetY}}) {
		let {context} = this;
		
		this.sx = offsetX;
		this.sy = offsetY;
		context.beginPath();
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.lineWidth = 30;
		context.lineCap = 'round';
		context.lineJoin = 'round';
		
		context.arc(offsetX, offsetY, Math.floor(30 / 2), 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
		context.beginPath();
	}

	move(offsetX, offsetY) {
		let {context} = this;
		let mx = offsetX - this.sx;
		let my = offsetY - this.sy;		

		context.moveTo(this.sx, this.sy);

		this.sx += mx;
		this.sy += my;
		context.lineTo(this.sx, this.sy);
		context.stroke();
	}

	stop() {
		this.context.closePath();
	}

	dispose() {
		this.canvas = null;
		this.context = null;
	}
}