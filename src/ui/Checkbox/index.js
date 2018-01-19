import React from 'react';
import Icon from '../Icon';

export default class Checkbox extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, disabled, name, value = '', children} = this.props;
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
			<label class="self $classes $?checked $?disabled" onClick={this.handleChange}>
				<span class="control">
					{checked && (
						<Icon icon="checked"/>
					)}
				</span>
				<span class="label">
					{children}
				</span>
			</label>
		)
	}

	handleChange = (e) => {
		let {onChange, name, value, checked, disabled} = this.props;
		if (!disabled) {
			onChange(name, value, !checked);
		}
	}
}
