import React from 'react';
import Dialog from '../../ui/Dialog';
import Form from '../../ui/Form';
import FormField from '../../ui/FormField';
import FormSubmit from '../../ui/FormSubmit';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
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
		let {formData, mode} = this.state;
		return (
			 <Dialog 
			 	title={mode == 'r' ? dict.registration : dict.auth}
	            onClose={onClose}
	            classes="x-task-narrow-dialog">	            
	            
	            <Form 
	            	onChange={this.handleFormChange}
	            	onSubmit={onSubmit}>

	            	<FormField caption={dict.login}>
	            		<Input name="login" value={formData.login}/>
	            	</FormField>

	            	<FormField 
	            		caption={dict.password}
	            		classes="mt10">
	            		<Input type="password" name="password" value={formData.password}/>
	            	</FormField>

	            	<FormField 
	            		caption={dict.password2} 
	            		classes="mt10"
	            		isPresent={mode == 'r'}>
	            		<Input type="password" name="password2" value={formData.password2}/>
	            	</FormField>

	            	<FormField 
	            		caption={dict.name}
	            		classes="mt10"
	            		isPresent={mode == 'r'}>
	            		<Input name="name" value={formData.name}/>
	            	</FormField>

	            	<FormField 
	            		caption={dict.email}
	            		classes="mt10"
	            		isPresent={mode == 'r'}>
	            		<Input name="email" value={formData.email}/>
	            	</FormField>

	            	<FormField 
	            		caption={dict.invitation}
	            		classes="mt10"
	            		isPresent={mode == 'r'}>
	            		<Input name="code" value={formData.code}/>
	            	</FormField>

	            	<FormSubmit classes="mt20 x-task-fr">
	            		{mode == 'r' ? dict.register : dict.enter}
	            	</FormSubmit>

	            	<Button 
	            		classes="x-task-white-button mt20"
	            		onClick={this.changeModeButtonClick}>
	            		{mode == 'r' ? dict.enter : dict.registration}
	            	</Button>
				</Form>
	        </Dialog>
		)
	}

	handleFormChange = (formData) => {
		this.setState({formData});
	}

	changeModeButtonClick = () => {
		this.setState({mode: this.state.mode == 'r' ? 'a' : 'r'});
	}
}