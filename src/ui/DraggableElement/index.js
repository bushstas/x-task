import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class DraggableElement extends React.PureComponent {

	static defaultProps = {
		onChangeCoords: () => {}
	}

	constructor(props) {
		super();
		this.mx = props.mx;
		this.my = props.my;
	}

	render() {
		let {classes, children} = this.props;
	 	return (
	 		<div ref="element"
	 			className={classnames('x-task-draggable-element', classes)}
	 			onMouseDown={this.handleMouseDown}>
				{children}
			</div>
		)
	}

	handleMouseDown = ({clientX, clientY}) => {
		this.x = clientX;
		this.y = clientY;
		document.body.addEventListener('mousemove', this.handleMouseMove, false);
		document.body.addEventListener('mouseup', this.handleMouseUp, false);
	}

	handleMouseUp = () => {
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
		document.body.removeEventListener('mouseup', this.handleMouseUp, false);

		this.props.onChangeCoords(this.mx, this.my);
	}

	handleMouseMove = ({clientX, clientY}) => {
		let sx = clientX - this.x;
		let sy = clientY - this.y;
		this.x = clientX;
		this.y = clientY;

		this.mx += sx;
		this.my += sy;

		let {element} = this.refs;
		element.style.marginLeft = this.mx + 'px';
		element.style.marginTop = this.my + 'px';
	}
}