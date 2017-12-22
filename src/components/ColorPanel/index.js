import React from 'react';

const COLORS = [
	'black', 'pale', 'red', 'green', 'blue', 'orange'
]

export default class ColorPanel extends React.Component {

	render() {
		return (
			<div class="self" onClick={this.props.onPickColor}>
				{COLORS.map(this.renderColorButton)}
			</div>
		)
	}

	renderColorButton = (color) => {
		let className = $classy(color, '.', ['black', 'pale', 'red', 'green', 'blue', 'orange']);
		return (
			<div class="$className" key={color} data-color={color}/>
		)
	}

}