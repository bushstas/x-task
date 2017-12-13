import React from 'react';
import classnames from 'classnames';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';

import './index.scss';

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
			onClick
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
	 		</VisualElement>

		)
	}

	get startYPosition() {
		return ~~document.documentElement.scrollTop + 100;
	}

	handleWheel = (e) => {
		e.preventDefault();
		this.refs.element.handleChangeSize({a: e.deltaY > 0 ? 4 : -4});
	}
}