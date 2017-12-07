import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class Input extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, name, value, placeholder} = this.props;
		return (
			<div className={classnames('x-task-input', classes)}>
				<input 
					type={this.type}
					name={name}
					value={value || ''}
					placeholder={placeholder}
					onChange={this.handleChange}/>
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