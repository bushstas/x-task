import React from 'react';
import DraggableElement from '../DraggableElement';
import Resizers from '../Resizers';
import {DEFAULT_SIZES} from '../../consts/max_sizes';
import {getScrollTop} from '../../utils';
import {handleResize} from '../../utils/MouseHandlers';

export default class VisualElement extends React.PureComponent {

	static defaultProps = {
		onClick: () => {},
		onChange: () => {},
		onWheel: () => {}
	}

	render() {
		let {data, classes, active, resizers, type, children, set} = this.props;
		let {
			mx = this.mx,
			my = this.my,
			width = this.width,
			height = this.height,
			locked,
			fixed,
			color
		} = data;
		let {dragged} = this.state || {};
		let className = $classy(color, '.', ['black', 'pale', 'red', 'green', 'blue', 'orange']);
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
	 			classes="self $classes $className $?.dragged $?.locked $?.active $?.fixed">
	 			{!locked && resizers && (
	 				<Resizers
	 					type={type}
	 					set={set}
	 					onChange={this.handleChange}/>
	 			)}
				{children}
			</DraggableElement>
		)
	}

	get mx() {
		return this.props.data.mx || 0;
	}

	get my() {
		return this.props.data.my || getScrollTop() + 100;
	}

	get width() {
		return this.props.data.width || this.defaultWidth;
	}

	get height() {
		return this.props.data.height || this.defaultHeight;
	}

	get defaultWidth() {
		return DEFAULT_SIZES[this.props.type] && DEFAULT_SIZES[this.props.type].width;
	}

	get defaultHeight() {
		return DEFAULT_SIZES[this.props.type] && DEFAULT_SIZES[this.props.type].height;
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
		this.setState({dragged: false});
	}

	handleMove = (sx, sy) => {
		let {locked, mx = this.mx, my = this.my} = this.props.data;
		if (locked) return;
		mx += sx;
		my += sy;
		this.props.onChange({mx, my});
	}

	handleChange = (changes, type) => {
		let {
			data: {
				mx = this.mx,
				my = this.my,
				width = this.width,
				height = this.height
			},
			set
		} = this.props;

		this.props.onChange(
			handleResize(changes, type, {mx, my, width, height, set})
		);
	}
}