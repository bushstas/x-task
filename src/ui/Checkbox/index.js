import React from 'react';

import './index.scss';

export default class Checkbox extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, children} = this.props;
		return (
			<label class="self $classes">
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