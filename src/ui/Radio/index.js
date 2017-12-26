import React from 'react';

export default class Radio extends React.PureComponent {
	static defaultProps = {
		onChange: () => {}
	}

	render() {
		let {classes, checked, children} = this.props;
		return (
			<label class="self $classes">
				<input 
					type="radio"
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
		onChange(name, value);
	}
}