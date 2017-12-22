import React from 'react';
import {dict} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';

export default class Text extends React.Component {

	static defaultProps = {
		onChangeSize: () => {}
	}

	componentDidMount() {
		if (this.refs.input) {
			this.refs.input.focus();
		}
	}

	render() {
		let {
			data: {
				mx = 0,
				my = this.startYPosition,
				width = 400,
				height = 80,
				fontSize = 20,
				fixed,
				locked,
				text = ''
			},
			onChangeCoords,
			onChangeSize,
			index,
			classes,
			active,
			onClick,
			onChangeText
		} = this.props;

		let resizerProps = {
			elementType: 'text'
		};
	 	return (
	 		<VisualElement 
	 			ref="element"
	 			classes="self $classes $?.active $?.fixed"
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
	 			
 				<textarea 
 					ref="input"
 					value={text}
 					onChange={onChangeText}
 					style={{fontSize: fontSize + 'px'}}
 					spellCheck="false"/>
	 			
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
		return ~~document.documentElement.scrollTop + 100;
	}

	handleWheel = (e) => {
		e.preventDefault();
		let {fontSize} = this.props;
		
		//this.refs.element.handleChangeSize({a: e.deltaY > 0 ? add : -add}, 'selection');
	}
}