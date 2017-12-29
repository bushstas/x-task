import React from 'react';

export default class Checkbox extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, name, value = '', children} = this.props;
		if (typeof checked != 'boolean') {
			checked = !!checked;
		}
		let props = {
			type: 'checkbox',
			checked,
			name,
			value,
			onChange: this.handleChange
		}
		return (
			<label class="self $classes">
				<input {...props}/>
				<span>
					{children}
				</span>
			</label>
		)
	}

	handleChange = (e) => {
		let {onChange, name, value} = this.props;
		onChange(name, value, e.target.checked);
	}
}