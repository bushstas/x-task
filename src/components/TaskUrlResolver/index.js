import React from 'react';
import Input from '../../ui/Input';

export default class TaskUrlResolver extends React.Component {

	render() {
		let {dict} = this.props;
		return (
	 		<div class="self">
	 			<div class="caption">
	 				{dict.caption1}:
	 			</div>
	 			{this.renderInput(0)}
	 			
	 			<div class="caption">
	 				{dict.caption2}:
	 			</div>
	 			{this.additionalInputs}
	 		</div>
	 	)
	}

	get additionalInputs() {
		let {urls} = this.props;
		let inputs = [];
		for (let i = 1; i <= 20; i++) {
			inputs.push(
				this.renderInput(i)
			);
		}
		return inputs;
	}

	renderInput(idx) {
		let value = this.props.urls[idx];
		return (
			<Input 
				key={idx} 
				name={idx} 
				value={value}
				onChange={this.handleChange}/>
		)
	}

	handleChange = (name, value) => {
		let {urls} = this.props;
		urls[name] = value;
		console.log(urls)
		this.props.onChange(urls);
	}
}