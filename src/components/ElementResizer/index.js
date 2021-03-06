import React from 'react';
import DraggableElement from '../DraggableElement';

export default class ElementResizer extends React.PureComponent {

	static defaultProps = {
		onChange: () => {},
		onClick: () => {},
		type: 'selection'
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
	 			classes="self $?dragged $classes"/>
		)
	}

	handleMove = (sx, sy) => {
		let {position, type} = this.props;
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

			case 'lt':
				l = -sx;
				t = -sy;
			break;

			case 'rt':
				r = sx;
				t = -sy;
			break;

			case 'rb':
				r = sx;
				b = sy;
			break;

			case 'lb':
				l = -sx;
				b = sy;
			break;
		}
		this.props.onChange({l, r, t, b}, type);
	}

	handleClick = (e) => {
		this.props.onClick(e);
		this.setState({dragged: true});
	} 

	handleDragEnd = (mx, my) => {
		this.setState({dragged: false});	
	}
}