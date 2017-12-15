import React from 'react';
import Checkbox from '../Checkbox';

export default class Checkboxes extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, name, value} = this.props;
		return (
			<div class="self $classes">
				{this.controls}
			</div>
		)
	}

	get controls() {
		let {items} = this.props;
		let values = this.values;
		if (items instanceof Array) {
			return items.map((item, i) => {
				let checked = values.indexOf(item.value) > -1;
				return (
					<Checkbox 
						key={item.value}
						checked={checked}
						value={item.value}
						onChange={this.handleControlChange}>
						{item.label}
					</Checkbox>
				)
			});
		}
	}

	get values() {
		let {value} = this.props;
		if (!(value instanceof Array)) {
			value = [];
		}
		return value;
	}

	handleControlChange = (name, value, checked) => {
		let values = this.values;
		let idx = values.indexOf(value);
		if (checked && idx == -1) {
			values.push(value);
		} else if (!checked && idx > -1) {
			values.splice(idx, 1);
		}
		this.props.onChange(this.props.name, values);
	}
}