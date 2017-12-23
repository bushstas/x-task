import React from 'react';
import {dict} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import ElementResizer from '../ElementResizer';
import {TEXT_SIZES} from '../../consts/max_sizes';
import {getScrollTop} from '../../utils';

export default class Text extends React.Component {

	static defaultProps = {
		onChange: () => {}
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
				color,
				fixed,
				locked,
				text = dict.txt
			},
			onChange,
			index,
			active,
			onClick
		} = this.props;

		let resizerProps = {
			elementType: 'text'
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
	 			
 				<textarea 
 					ref="input"
 					value={text}
 					onChange={this.handleChangeText}
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
		return getScrollTop() + 100;
	}

	handleChangeText = ({target: {value}}) => {
		this.props.onChange({text: value});
	}

	handleWheel = (e) => {
		e.preventDefault();
		let {data: {fontSize = 20}} = this.props;
		let add = 2 * (e.deltaY > 0 ? 1 : -1);
		fontSize = Math.min(TEXT_SIZES.max, Math.max(TEXT_SIZES.min, fontSize + add));
		this.props.onChange({fontSize});
	}
}