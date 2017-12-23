import React from 'react';

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
			onWheel
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
		let props = {
			ref: 'element',
			onWheel,
			onMouseDown: this.handleMouseDown,
			className: $classy('$classes'),
			style
		};
	 	return (
	 		<div {...props}>
				{children}
			</div>
		)
	}

	handleMouseDown = (e) => {
		e.stopPropagation();
		let {clientX, clientY} = e;
		let {onClick, index} = this.props;
		onClick(index);
		this.x = clientX;
		this.y = clientY;
		document.body.addEventListener('mousemove', this.handleMouseMove, false);
		document.body.addEventListener('mouseup', this.handleMouseUp, false);
	}

	handleMouseUp = () => {
		document.body.removeEventListener('mousemove', this.handleMouseMove, false);
		document.body.removeEventListener('mouseup', this.handleMouseUp, false);
		let {mx, my} = this.props;
		this.props.onDragEnd(mx, my);
	}

	handleMouseMove = ({clientX, clientY}) => {
		let sx = clientX - this.x;
		let sy = clientY - this.y;
		this.x = clientX;
		this.y = clientY;
		this.props.onMove(sx, sy);
	}
}