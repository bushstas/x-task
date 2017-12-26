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
		let {props: {maskShown, added, removed}} = this;
		if (maskShown) {
			if (added || removed) {
				if (removed) {
					this.canvas.fillCut(removed);
				}
				if (added) {
					for (let a of added) {
						this.canvas.cut(a);
					}
				}
			} else {
				this.redraw();
			}
		}
	}

	redraw = () => {
		if (this.props.maskShown) {
			let {cuts, maskOpacity, layers, id} = this.props;
			this.canvas.init(this.refs.canvas);
			this.canvas.resize();
			this.canvas.fill(maskOpacity);
			for (let k in cuts) {
				if (!layers || !id || id == k) {
					this.canvas.cut(cuts[k]);
				}
			}
		}
	}

	render() {
	 	return this.props.maskShown ? (
	 		<canvas ref="canvas" class="self"/>
		) : null;
	}
}

const params = {
  has: 'mask',
  flat: true
}
export default Store.connect(Mask, params);
