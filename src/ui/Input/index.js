import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class Input extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {textarea, classes, name, value = '', placeholder} = this.props;
		let props = {
			name,
			value,
			placeholder,
			onChange: this.handleChange
		}
		if (!textarea) {
			props.type = this.type;
			props.value = value;
		} else {
			props.spellCheck = 'false';
		}
		return (
			<div className={classnames('x-task-input', classes)}>
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