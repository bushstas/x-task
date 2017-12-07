import React from 'react';
import Dialog from '../../ui/Dialog';
import Form from '../../ui/Form';
import {dict} from '../../utils/Dictionary';

export default class AuthForm extends React.Component {
	render() {
		let {onClose} = this.props;
		return (
			 <Dialog 
			 	title={dict.auth}
	            onClose={onClose}
	            classes="x-task-narrow-dialog">	            
	            
	            <Form 
	            	onChange={this.handleFormChange}
	            	onSubmit={this.handleFormSubmit}>

				</Form>
	        </Dialog>
		)
	}

	handleFormChange = () => {

	}

	handleFormSubmit = () => {
		
	}
}