import React from 'react';
import Input from '../../ui/Input';
import Checkbox from '../../ui/Checkbox';
import FormField from '../../ui/FormField';
import Form from '../../ui/Form';
import {initUrls, hasHash, hasGetParams} from '../../utils/TaskResolver';

export default class TaskUrlResolver extends React.Component {

	render() {
		let {dict} = this.props;
		return (
	 		<div class="self">
	 			<Form onControlChange={this.handleChange}>
		 			<div class="caption">
		 				{dict.caption1}:
		 			</div>
		 			{this.renderInput(0)}
		 			
		 			<div class="caption">
		 				{dict.caption2}:
		 			</div>
		 			{this.additionalInputs}
		 		</Form>
	 		</div>
	 	)
	}

	get additionalInputs() {
		let {urls} = this.props;
		let count = Object.keys(urls).length + 1;
		let inputs = [];
		for (let i = 1; i < count; i++) {
			inputs.push(
				this.renderInput(i)
			);
		}
		return inputs;
	}

	renderInput(idx) {
		let value = this.props.urls[idx];
		let tooltip;
		if (idx < 2) {
			tooltip = idx == 0 ? 'task_main_url' : 'task_url';
		}
		let props = {
			name: idx,
			value
		}
		if (idx == 0) {
			props.readOnly = true;
		}
		return (
			<FormField tooltip={tooltip} key={idx}>
				<Input {...props}/>
				{idx == 0 && this.options}
			</FormField>
		)
	}

	get options() {
		let {dict, nohashes, noparams} = this.props;
		return (
			<div>
				{hasHash() && (
					<Checkbox 
		 				name="nohashes"
		 				checked={!!nohashes}>
		 				{dict.nohashes}
		 			</Checkbox>
		 		)}
	 			{hasGetParams() && (
	 				<Checkbox 
		 				name="noparams"
		 				checked={!!noparams}>
		 				{dict.noparams}
		 			</Checkbox>
		 		)}
		 		{noparams && (
		 			<Input 
		 				name="getparams"
		 				textarea/>
		 		)}
	 		</div>
	 	)
	}

	handleChange = (name, value) => {
		if (typeof name == 'string') {
			initUrls({[name]: value});	
		} else {
			let {urls} = this.props;
			urls[name] = value;
			this.props.onChange({urls});
		}
	}
}