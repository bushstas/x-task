import React from 'react';
import Canvas from '../../utils/Canvas';

export default class Mask extends React.PureComponent {

	componentDidMount() {
		Canvas.init(this.canvas);
		Canvas.resize();
		Canvas.fill(this.opacity);
	}

	render() {		
	 	return (
	 		<canvas ref="canvas" class="self"/>
		)
	}

	get canvas() {
		return this.refs.canvas;
	}

	get opacity() {
		return 0.85;
	}

}