import React from 'react';
import Dialog from '../../ui/Dialog';
import Form from '../../ui/Form';
import FormField from '../../ui/FormField';
import FormSubmit from '../../ui/FormSubmit';
import Input from '../../ui/Input';
import {dict} from '../../utils/Dictionary';

export default class AuthForm extends React.Component {
	constructor() {
		super();
		this.state = {
			formData: {}
		};
	}

	render() {
		let {onClose, onSubmit} = this.props;
		let {formData: {login, password}} = this.state;
		return (
			 <Dialog 
			 	title={dict.auth}
	            onClose={onClose}
	            classes="x-task-narrow-dialog">	            
	            
	            <Form 
	            	onChange={this.handleFormChange}
	            	onSubmit={onSubmit}>

	            	<FormField caption={dict.login}>
	            		<Input name="login" value={login}/>
	            	</FormField>

	            	<FormField caption={dict.password} classes="mt15">
	            		<Input type="password" name="password" value={password}/>
	            	</FormField>

	            	<FormSubmit classes="mt15">
	            		Войти
	            	</FormSubmit>
				</Form>
	        </Dialog>
		)
	}

	handleFormChange = (formData) => {
		this.setState({formData});
	}
}