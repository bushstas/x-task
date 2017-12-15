import React from 'react';

export default class Select extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, name, value} = this.props;
		return (
			<div class="self $classes">
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
				let {value, name, title, id} = o;
				value = typeof value != 'undefined' ? value : id || '';
				title = typeof title != 'undefined' ? title : name || '';
				return (
					<option value={value} key={value}>
						{title}
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