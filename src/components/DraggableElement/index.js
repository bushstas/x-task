import React from 'react';
import classnames from 'classnames';

export default class DraggableElement extends React.PureComponent {

	static defaultProps = {
		onClick: () => {},
		onDragEnd: () => {},
		onMove: () => {}
	}

	render() {
		let {
			classes, 
			children, 
			mx, 
			my, 
			width, 
			height, 
			onClick, 
			onWheel,
			locked
		} = this.props;
		let style;
		if (typeof mx == 'number') { 
			style = {
				marginLeft: mx + 'px',
				marginTop: my + 'px',
				width: width + 'px',
				height: height + 'px'
			}
		}
	 	return (
	 		<div ref="element" 
	 			className={classnames(classes, locked ? 'x-task-locked' : '')}
	 			style={style}
	 			onWheel={onWheel}
	 			onMouseDown={this.handleMouseDown}>
				{children}
			</div>
		)
	}

	handleMouseDown = (e) => {
		let {clientX, clientY} = e;
		let {onClick, index} = this.props;
		onClick(index);
		this.x = clientX;
		this.y = clientY;
		document.body.addEventListener('mousemove', this.handleMouseMove, false);
		document.body.addEventListener('mouseup', this.handleMouseUp, false);
		e.stopPropagation();
	}

	handleMouseUp = () => {
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
		document.body.removeEventListener('mouseup', this.handleMouseUp, false);
		this.props.onDragEnd(this.mx, this.my);
	}

	handleMouseMove = ({clientX, clientY}) => {
		let sx = clientX - this.x;
		let sy = clientY - this.y;
		this.x = clientX;
		this.y = clientY;
		this.props.onMove(sx, sy);
	}
}