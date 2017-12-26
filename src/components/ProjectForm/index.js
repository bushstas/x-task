import React from 'react';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormField from '../../ui/FormField';
import Radios from '../../ui/Radios';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import {isCurrentProject} from '../../utils/User';

class ProjectForm extends React.Component {
	render() {
		let {formData: data, editedProject} = this.props;
		let isOnProject = isCurrentProject(editedProject);
		return (
			<Form 
				data={data}
				onChange={this.handleFormChange}
				classes="self .pt10">

				<FormField caption={dict.title}>
					<Input 
						name="name"
						value={data.name || ''}
						placeholder="My project"/>
				</FormField>

				<FormField caption={dict.main_page} classes=".mt15" tooltip="project_homepage">
					<Input 
						name="homepage"
						value={data.homepage || ''}
						placeholder="https://my-project.com"/>
				</FormField>

				<FormField caption={dict.domain} classes=".mt15" tooltip="project_domain">
					<Input 
						name="domain"
						value={data.domain || ''}
						placeholder="my-project.com"/>
				</FormField>

				<FormField classes=".mt15">
					<Radios name="option" value={data.option || '1'} items={this.radios}/>
				</FormField>
			</Form>
		)
	}

	get radios() {
		let radios = [];
		let a = [
			{value: '1', label: 'Привет'},
			{value: '2', label: 'Пока'}
		]

		return a//radios;
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