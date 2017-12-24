import React from 'react';
import {dict} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import {handleWheel} from '../../utils/MouseHandlers';

const TYPE = 'descr';

export default class Text extends React.Component {
	componentDidMount() {
		if (this.props.active && this.refs.input) {
			this.refs.input.focus();
		}
	}

	render() {
		let {fontSize = 20, text = dict.txt, color} = this.props.data;
		let className = $classy(color, '.', ['black', 'pale', 'red', 'green', 'blue', 'orange']);
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			ref="element"
	 			classes="self $className"
	 			type={TYPE}
	 			onWheel={this.handleWheel}>
	 			
 				<textarea 
 					ref="input"
 					value={text}
 					onChange={this.handleChangeText}
 					style={{fontSize: fontSize + 'px', lineHeight: fontSize + 'px'}}
 					spellCheck="false"/>
	 		</VisualElement>

		)
	}

	handleChangeText = ({target: {value}}) => {
		this.props.onChange({text: value});
	}

	handleWheel = (e) => {
		this.props.onChange(
			handleWheel(e, TYPE, this.props.data)
		);
	}
}