import React from 'react';
import Radio from '../Radio';

export default class Radios extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes} = this.props;
		return (
			<div class="self $classes">
				{this.controls}
			</div>
		)
	}

	get controls() {
		let {items, name, value, onChange} = this.props;
		let values = this.values;
		if (items instanceof Array) {
			return items.map((item, i) => {
				let checked = item.value == value;
				return (
					<Radio 
						name={name}
						key={item.value}
						checked={checked}
						value={item.value}
						onChange={onChange}>
						{item.label}
					</Radio>
				)
			});
		}
	}
}