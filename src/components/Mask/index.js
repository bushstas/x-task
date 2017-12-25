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
			let {cuts, maskOpacity, layers, layerId} = this.props;
			this.canvas.init(this.refs.canvas);
			this.canvas.resize();
			this.canvas.fill(maskOpacity);
			for (let k in cuts) {
				if (!layers || !layerId || layerId == k) {
					this.canvas.cut(cuts[k]);
				}
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

	get isShown() {
		return this.props.maskShown;
	}
}

const params = {
  has: 'mask',
  flat: true
}
export default Store.connect(Mask, params);
