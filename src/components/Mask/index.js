import React from 'react';
import Canvas from '../../utils/Canvas';
import Store from 'xstore';

let timeuot;
class Mask extends React.Component {

	componentDidMount() {
		this.redraw();
		window.addEventListener('resize', this.redraw);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.redraw);
	}

	componentDidUpdate() {
		this.redraw();
	}

	redraw = () => {
		if (this.isShown) {
			Canvas.init(this.canvas);
			Canvas.resize();
			Canvas.fill(this.opacity);
			for (let k in this.cuts) {
				Canvas.cut(this.cuts[k]);
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

	get canvas() {
		return this.refs.canvas;
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
