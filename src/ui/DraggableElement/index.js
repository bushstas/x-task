import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class DraggableElement extends React.PureComponent {

	constructor() {
		super();
		this.mx = 0;
		this.my = 100;
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
		let {index} = this.props;
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
		document.body.removeEventListener('mouseup', this.handleMouseUp, false);

		this.props.onChangeCoords(index, this.mx, this.my);
	}

	handleMouseMove = ({clientX, clientY}) => {
		let sx = clientX - this.x;
		let sy = clientY - this.y;
		this.x = clientX;
		this.y = clientY;

		this.mx += sx;
		this.my += sy;

		this.refs.element.style.marginLeft = this.mx + 'px';
		this.refs.element.style.marginTop = this.my + 'px';
	}
}