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

	clear() {
		let width = this.width || this.canvas.width;
		let height = this.height || this.canvas.height;
		this.context.clearRect(0, 0, width, height);
	}

	fill(opacity) {
		let {context} = this;
		this.clear();
		context.globalAlpha = opacity;
		context.rect(0, 0, this.width, this.height);
		context.fillStyle = 'white';
		context.fill();
	}

	getCutCoords(data) {
		let {x, y, width, height, fixed} = data;	
	    if (fixed) {
	    	y += getScrollTop();
	    }	    
	    return {x, y, width, height};
	}

	cut(data) {
		if (this.context) {
			let {x, y, width, height} = this.getCutCoords(data);
			this.context.clearRect(x, y, width, height);
		}
	}

	fillCut(data) {
		if (this.context) {
			let {x, y, width, height} = this.getCutCoords(data);
			this.context.fillRect(x - 2, y - 2, width + 4, height + 4);
		}
	}

	set({size, color}) {
		this.size = size - 2;
		this.color = color;
	}

	initContext(color, size) {
		let {context} = this;
		context.shadowBlur = 1;
		context.shadowColor = color;
		context.strokeStyle = color;
		context.fillStyle = color;
		context.lineWidth = size;
		context.lineCap = 'round';
		context.lineJoin = 'round';
	}

	start({nativeEvent: {offsetX, offsetY}}) {
		let {context} = this;
		this.initContext(this.color, this.size);
		this.path = [offsetX + 'x' + offsetY];
		this.sx = offsetX;
		this.sy = offsetY;
		context.beginPath();
		context.arc(offsetX, offsetY, Math.floor(this.size / 2), 0, Math.PI * 2, true);
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
		this.path.push(this.sx + 'x' + this.sy);
		context.lineTo(this.sx, this.sy);
		context.stroke();
	}

	stop() {
		if (this.path) {
			this.context.closePath();
			let path = this.color + '_' + this.size + '_' + this.path.join('.');
			this.path = null;
			return path;
		}
	}

	draw(path) {
		if (path instanceof Array) {
			this.clear();
			let {context} = this;
			for (let p of path) {
				let ps = p.split('_'),
					color = ps[0],
					size = ps[1],
					points = ps[2].split('.'),
					i = 0;

				this.initContext(color, size);

				let prevs;
				for (let pnt of points) {
					let pnts = pnt.split('x');
					if (i == 0) {
						context.beginPath();
						context.arc(pnts[0], pnts[1], Math.floor(size / 2), 0, Math.PI * 2, true);
						context.closePath();
						context.fill();
						context.beginPath();
					} else {
						context.moveTo(prevs[0], prevs[1]);
						context.lineTo(pnts[0], pnts[1]);
						context.stroke();
					}
					i++;
					prevs = pnts;
				}
				context.closePath();
			}
		}
	}

	dispose() {
		this.canvas = null;
		this.context = null;
	}
}