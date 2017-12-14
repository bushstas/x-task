import React from 'react';
import DraggableElement from '../DraggableElement';

import './index.scss';

export default class ElementResizer extends React.PureComponent {

	static defaultProps = {
		onChangeSize: () => {},
		onClick: () => {}
	}

	constructor(props) {
		super();
		this.state = {};
		this.mx = props.mx;
		this.my = props.my;
	}

	render() {
		let {onClick, position, classes} = this.props;
		let {dragged} = this.state;
	 	return (
	 		<DraggableElement
	 			onMove={this.handleMove}
	 			onClick={this.handleClick}
	 			onDragEnd={this.handleDragEnd}
	 			classes=".element-resizer $dragged?.dragged $classes"/>
		)
	}

	handleMove = (sx, sy) => {
		let {position} = this.props;
		let l, r, t, b;
		switch (position) {
			case 'l':
				l = -sx;
			break;

			case 'r':
				r = sx;
			break;

			case 't':
				t = -sy;
			break;

			case 'b':
				b = sy;
			break;
		}
		this.props.onChangeSize({l, r, t, b}, 'selection');
	}

	handleClick = (e) => {
		this.props.onClick(e);
		this.setState({dragged: true});
	} 

	handleDragEnd = (mx, my) => {
		this.setState({dragged: false});	
	}
}