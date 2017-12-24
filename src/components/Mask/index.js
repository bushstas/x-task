import React from 'react';
import Canvas from '../../utils/Canvas';
import Store from 'xstore';

let timeuot;
class Mask extends React.Component {
	constructor() {
		super();
		this.canvas = new Canvas();
	}

	componentDidMount() {
		this.redraw();
		window.addEventListener('resize', this.redraw);
		window.addEventListener('scroll', this.redraw);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.redraw);
		window.removeEventListener('scroll', this.redraw);
		this.canvas.dispose();
		this.canvas = null;
	}

	componentDidUpdate() {
		this.redraw();
	}

	redraw = () => {
		if (this.isShown) {
			this.canvas.init(this.refs.canvas);
			this.canvas.resize();
			this.canvas.fill(this.opacity);
			for (let k in this.cuts) {
				this.canvas.cut(this.cuts[k]);
			}
		}
	}

	render() {
		if (!this.isShown) {
			return null;
		}
	 	return (
	 		<canvas ref="canvas" class="self"/>
		)
	}

	get cuts() {
		return this.props.cuts;
	}

	get isShown() {
		return this.props.maskShown;
	}

	get opacity() {
		return this.props.maskOpacity;
	}
}

const params = {
  has: 'mask',
  flat: true
}
export default Store.connect(Mask, params);
