import React from 'react';
import Dialog from '../../ui/Dialog';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';
import ActionButtons from '../ActionButtons';
import Icon from '../../ui/Icon';
import Button from '../../ui/Button';

export default class TaskInfoForm extends React.Component {
	render() {
		let {onClose, onFormChange, dict, formData} = this.props;
		return (
			 <Dialog title={dict.title}
	            onClose={onClose}
	            clickMaskToClose={true}
	            classes="dialog::large self">
	            
	            <Form 
	            	data={formData}
	            	onChange={onFormChange}>
					{this.list}
					{this.fields}
				</Form>
				<ActionButtons onAction={this.handleAction}>					
					<Button data-value="preview">
						{dict.preview}
					</Button>
				</ActionButtons>
	        </Dialog>
		)
	}

	get list() {
		let {taskList = {}, dict, onListChange} = this.props;
		let fields = [];
		for (let i = 0; i < 10; i++) {
			fields.push(i);
		}
		return (
			<div class="list">
				<div class="list-caption">
					{dict.list}
				</div>
				{fields.map((value) => {
					return (
						<div class="list-item" key={value}>
							<Icon icon="checked"/>
							<Input 
								name={'item' + value}
								value={taskList[value]}
								onChange={onListChange}/>
						</div>
					)
				})}
			</div>
		)
	}

	get fields() {
		let {formData, dict} = this.props;
		let {icons, captions} = dict;
		if (icons instanceof Object) {
			let keys = Object.keys(icons);
			return keys.map((value) => {
				return (
					<FormField caption={captions[value]} key={value}>
						<Icon>
							{icons[value]}
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