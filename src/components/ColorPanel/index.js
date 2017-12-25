import React from 'react';
import {COLORS, DEFAULT_COLOR} from '../../consts/colors';

export default class ColorPanel extends React.Component {

	render() {
		return (
			<div class="self" onClick={this.props.onPickColor}>
				{Object.keys(COLORS).map(this.renderColorButton)}
			</div>
		)
	}

	renderColorButton = (color) => {
		let {color: currentColor = DEFAULT_COLOR} = this.props;
		let className = $classy(color, '.', ['black', 'pale', 'red', 'green', 'blue', 'orange']);
		let active = color == currentColor;
		return (
			<div 
				class="$className $?active"
				key={color}
				data-color={color}/>
		)
	}

}