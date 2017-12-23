import React from 'react';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';
import TaskMark from '../TaskMark';
import {getScrollTop} from '../../utils';

const MAX_SIZE = 1000;
const MIN_SIZE = 50;

export default class AreaSelection extends React.Component {

	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {
			data: {
				mx = 0,
				my = this.startYPosition,
				width = 150,
				height = 120,
				fixed,
				locked,
				color
			},
			onChange,
			index,
			active,
			onClick,
			bent,
			markProps
		} = this.props;

	 	return (
	 		<VisualElement 
	 			ref="element"
	 			classes="self"
	 			index={index}
	 			color={color}
	 			mx={mx}
	 			my={my}
	 			width={width}
	 			height={height}
	 			active={active}
	 			fixed={fixed}
	 			locked={locked}
	 			onClick={onClick}
	 			onWheel={this.handleWheel}
	 			onChange={onChange}>
	 			<ElementResizer position="t" classes="~t"/>
	 			<ElementResizer position="b" classes="~b"/>
	 			<ElementResizer position="l" classes="~l"/>
	 			<ElementResizer position="r" classes="~r"/>
	 			<ElementResizer position="lt" classes="~lt"/>
	 			<ElementResizer position="rt" classes="~rt"/>
	 			<ElementResizer position="rb" classes="~rb"/>
	 			<ElementResizer position="lb" classes="~lb"/>
	 			{bent && <TaskMark {...markProps}/>}
	 		</VisualElement>

		)
	}

	get startYPosition() {
		return getScrollTop() + 100;
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