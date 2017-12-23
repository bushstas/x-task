import React from 'react';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';
import {getScrollTop} from '../../utils';

export default class Drawing extends React.Component {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {
			data: {
				mx = 0,
				my = this.startYPosition,
				width = 300,
				height = 300,
				color,
				fixed,
				locked
			},
			onChange,
			index,
			active,
			onClick,
			onChangeText
		} = this.props;

		let resizerProps = {
			elementType: 'drawing'
		};

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
	 			
	 			<canvas width={width} height={height}/>
	 			<ElementResizer position="t" classes="~t" {...resizerProps}/>
	 			<ElementResizer position="b" classes="~b" {...resizerProps}/>
	 			<ElementResizer position="l" classes="~l" {...resizerProps}/>
	 			<ElementResizer position="r" classes="~r" {...resizerProps}/>
	 			<ElementResizer position="lt" classes="~lt" {...resizerProps}/>
	 			<ElementResizer position="rt" classes="~rt" {...resizerProps}/>
	 			<ElementResizer position="rb" classes="~rb" {...resizerProps}/>
	 			<ElementResizer position="lb" classes="~lb" {...resizerProps}/>
	 		</VisualElement>

		)
	}

	get startYPosition() {
		return getScrollTop() + 100;
	}

	handleWheel = (e) => {

	}
}