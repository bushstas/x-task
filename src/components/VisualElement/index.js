import React from 'react';
import classnames from 'classnames';
import DraggableElement from '../DraggableElement';
import ElementResizer from '../ElementResizer';

import './index.scss';

export default class VisualElement extends React.PureComponent {

	static defaultProps = {
		onClick: () => {},
		onChangeCoords: () => {},
		onWheel: () => {}
	}

	constructor(props) {
		super();
		this.state = {
			mx: props.mx,
			my: props.my,
			width: props.width,
			height: props.height
		}
	}

	render() {
		let {classes, locked} = this.props;
		let {mx, my, width, height, dragged} = this.state;
	 	return (
	 		<DraggableElement
	 			onMove={this.handleMove}
	 			onClick={this.handleClick}
	 			onDragEnd={this.handleDragEnd}
	 			onWheel={this.handleWheel}
	 			mx={mx}
	 			my={my}
	 			width={width}
	 			height={height}
	 			locked={locked}
	 			classes={classnames('x-task-visual-element', classes, dragged ? 'x-task-dragged' : '')}>
				{this.children}
			</DraggableElement>
		)
	}

	get children() {		
		let {children, locked} = this.props;
		if (children) {
			if (!(children instanceof Array)) {
				children = [children];
			}
			return children.map((child, i) => {
				if (child instanceof Object) {
					let props = {
						key: i
					}
					if (child.type == ElementResizer) {
						if (locked) {
							return;
						}
						props.onChangeSize = this.handleChangeSize;
					}
					return React.cloneElement(child, props, child.props.children);
				}
				return child;
			});
		}
	}

	handleWheel = (e) => {
		let {active, locked, onWheel} = this.props;
		if (active && !locked) {
			onWheel(e);
		} else {
			e.preventDefault();
		}
	}

	handleClick = () => {
		let {onClick, index} = this.props;
		onClick(index);
		this.setState({dragged: true});
	}

	handleDragEnd = (mx, my) => {
		this.props.onChangeCoords(mx, my);
		this.setState({dragged: false});
	}

	handleMove = (sx, sy) => {
		let {locked} = this.props;
		if (locked) return;
		let {mx, my} = this.state;
		mx += sx;
		my += sy;
		this.setState({mx, my});
	}

	handleChangeSize = ({l, r, t, b, a}) => {
		let {width, height, mx, my} = this.state;
		if (l) {
			width += l;
			mx -= l;
		} else if (r) {
			width += r;
		} else if (t) {
			height += t;
			my -= t;
		} else if (b) {
			height += b;
		} else if (a) {
			let w = Math.floor(width * a / 100);
			let h = Math.floor(height * a / 100);
			width += w;
			height += h;
			mx -= Math.floor(w / 2);
			my -= Math.floor(h / 2);
		}
		this.setState({
			width,
			height,
			mx,
			my
		});
	}
}