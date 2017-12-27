import React from 'react';

export default class Input extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {
			textarea,
			classes,
			value = '',
			onValidate,
			onChange,
			...others
		} = this.props;
		let props = {
			...others,
			value,
			onChange: this.handleChange						
		}
		if (!textarea) {
			props.type = this.type;
			props.value = value;
		} else {
			props.spellCheck = 'false';
		}
		return (
			<div class="self $classes">
				{textarea ? (
					<textarea {...props}>
						{value}
					</textarea>
				) : (
					<input {...props}/>
				)}
			</div>
		)
	}

	get type() {
		let {type} = this.props;
		return type || 'text';
	}

	handleChange = (e) => {
		let {onChange, name} = this.props;
		onChange(name, e.target.value);
	}
}