import React from 'react';
import classnames from 'classnames';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';
import TaskMark from '../TaskMark';

import './index.scss';

const MAX_SIZE = 1000;
const MIN_SIZE = 50;

export default class AreaSelection extends React.Component {

	static defaultProps = {
		onChangeSize: () => {}
	}

	render() {
		let {
			data: {
				mx = 0,
				my = this.startYPosition,
				width = 150,
				height = 120,
				fixed,
				locked
			},
			onChangeCoords,
			onChangeSize,
			index,
			classes,
			active,
			onClick,
			bent,
			markProps
		} = this.props;

	 	let className = classnames(
	 		'x-task-area-selection',
	 		classes,
	 		active ? 'active' : '',
	 		fixed ? 'x-task-fixed' : ''
	 	);
	 	return (
	 		<VisualElement 
	 			ref="element"
	 			classes={className}
	 			index={index}
	 			mx={mx}
	 			my={my}
	 			width={width}
	 			height={height}
	 			active={active}
	 			locked={locked}
	 			onClick={onClick}
	 			onWheel={this.handleWheel}
	 			onChangeCoords={onChangeCoords}
	 			onChangeSize={onChangeSize}>
	 			<ElementResizer position="t"/>
	 			<ElementResizer position="b"/>
	 			<ElementResizer position="l"/>
	 			<ElementResizer position="r"/>
	 			{bent && <TaskMark {...markProps}/>}
	 		</VisualElement>

		)
	}

	get startYPosition() {
		return ~~document.documentElement.scrollTop + 100;
	}

	handleWheel = (e) => {
		e.preventDefault();
		let {width, height} = this.props;
		let max = Math.max(width, height);
		let add = 3;
		if (max > 1000) {
			add = 0.6;
		} else if (max > 750) {
			add = 1.2;
		} else if (max > 500) {
			add = 1.8;
		} else if (max > 250) {
			add = 2.4;
		}
		this.refs.element.handleChangeSize({a: e.deltaY > 0 ? add : -add}, 'selection');
	}
}