import React from 'react';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormField from '../../ui/FormField';
import Checkboxes from '../../ui/Checkboxes';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import {isCurrentProject} from '../../utils/User';

import './index.scss';

class ProjectForm extends React.Component {
	render() {
		let {formData: data, editedProject} = this.props;
		let isOnProject = isCurrentProject(editedProject);
		return (
			<Form 
				data={data}
				onChange={this.handleFormChange}
				classes="x-task-project-form pt10">

				<FormField caption={dict.title}>
					<Input name="name" value={data.name}/>
				</FormField>

				<FormField caption={dict.main_page} classes="mt15">
					<Input name="homepage" value={data.homepage}/>
				</FormField>			
			</Form>
		)
	}

	handleFormChange = (data) => {
		this.props.dispatch('PROJECTS_FORM_DATA_CHANGED', data);
	}
}

const params = {
  has: 'projects',
  flat: true
}
export default Store.connect(ProjectForm, params);