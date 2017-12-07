import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class Select extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, name, value} = this.props;
		return (
			<div className={classnames('x-task-select', classes)}>
				<select 
					name={name}
					value={value}
					onChange={this.handleChange}>
					{this.options}
				</select>
			</div>
		)
	}

	get options() {
		let {options} = this.props;
		if (options instanceof Array) {
			return options.map((o, i) => {
				return (
					<option value={o.value}>
						{o.title}
					</option>
				)
			})
		}
	}

	handleChange = (e) => {
		let {onChange, name} = this.props;
		onChange(name, e.target.value);
	}
}