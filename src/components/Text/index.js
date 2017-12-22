import React from 'react';
import {dict} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';
import {TEXT_SIZES} from '../../consts/max_sizes';

export default class Text extends React.Component {

	static defaultProps = {
		onChangeSize: () => {},
		onChangeFontSize: () => {}
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
				text = dict.txt
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
 					style={{fontSize: fontSize + 'px', lineHeight: fontSize + 'px'}}
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
		let {data: {fontSize = 20}} = this.props;
		let add = 2 * (e.deltaY > 0 ? 1 : -1);
		fontSize = Math.min(TEXT_SIZES.max, Math.max(TEXT_SIZES.min, fontSize + add));
		this.props.onChangeFontSize(fontSize);
	}
}