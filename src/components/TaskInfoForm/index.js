import React from 'react';
import Dialog from '../../ui/Dialog';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';
import Icon from '../../ui/Icon';
import {dict, icons} from '../../utils/Dictionary';

import './index.scss';

export default class TaskInfoForm extends React.Component {
	render() {
		let {onClose, onFormChange} = this.props;
		return (
			 <Dialog title="Расширенное описание задачи"
	            onClose={onClose}
	            clickMaskToClose={true}
	            className="x-task-dialog-large x-task-info-form">
	            
	            <Form onChange={onFormChange}>
					{this.fields}
				</Form>

	        </Dialog>
		)
	}

	get fields() {
		let {formData} = this.props;
		let items = icons.task_inf;
		if (items instanceof Object) {
			let keys = Object.keys(items);
			return keys.map((value) => {
				return (
					<FormField caption={dict[value]} key={value}>
						<Icon>
							{items[value]}
						</Icon>
						<Input 
							name={value}
							value={formData[value]}
							textarea/>
					</FormField>
				)
			});
		}
	}
}