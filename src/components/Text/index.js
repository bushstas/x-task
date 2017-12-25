import React from 'react';
import {dict} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import {handleWheel} from '../../utils/MouseHandlers';
import VisualElementActions from '../VisualElementActions';

const TYPE = 'descr';

export default class Text extends React.Component {
	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		let {active, data: {action, locked}} = this.props;
		if (active && this.refs.input && action == 'write' && !locked) {
			this.refs.input.focus();
		}
	}

	render() {
		let {
			data: {
				fontSize = 20,
				text = dict.txt,
				locked,
				action = 'move'
			}
		} = this.props;
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			ref="element"
	 			classes="self"
	 			type={TYPE}
	 			onWheel={this.handleWheel}>

	 			{!locked && (
	 				<VisualElementActions 
	 					actions={['move', 'write']}
	 					active={action}/>
	 			)}
	 			
 				<textarea 
 					ref="input"
 					value={text}
 					onChange={this.handleChangeText}
 					style={{fontSize: fontSize + 'px', lineHeight: fontSize + 'px'}}
 					spellCheck="false"/>

 				{(locked || action != 'write') && (
 					<div class="mask"/>
 				)}
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