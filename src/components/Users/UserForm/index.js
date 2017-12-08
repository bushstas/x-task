import React from 'react';
import Form from '../../../ui/Form';
import Input from '../../../ui/Input';
import FormField from '../../../ui/FormField';
import {dict} from '../../../utils/Dictionary';

export default class UserForm extends React.Component {
	constructor() {
		super();
		this.state = {
			formData: {}
		}
	}

	render() {
		let {onSubmit} = this.props;
		let {formData: {login}} = this.state;
		return (
			<Form 
				onChange={this.handleFormChange}
				onSubmit={onSubmit}>
				
				<FormField caption={dict.login}>
					<Input name="login" value={login}/>
				</FormField>

				<FormField caption={dict.login}>
					<Input name="login" value={login}/>
				</FormField>
			</Form>
		)
	}

	handleFormChange = (formData) => {
		this.setState({formData});
	}
}