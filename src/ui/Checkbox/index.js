import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class Checkbox extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, children} = this.props;
		return (
			<label className={classnames('x-task-checkbox', classes)}>
				<input 
					type="checkbox"
					checked={checked}
					onChange={this.handleChange}/>
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