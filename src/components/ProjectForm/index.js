import React from 'react';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormField from '../../ui/FormField';
import Radios from '../../ui/Radios';
import Store from 'xstore';
import {isCurrentProject} from '../../utils/User';

class ProjectForm extends React.Component {
	render() {
		let {formData: data, editedProject, dict} = this.props;
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

				<FormField caption={dict.homepage} classes=".mt15" tooltip="project_homepage">
					<Input 
						name="homepage"
						value={data.homepage || ''}
						placeholder="https://my-project.com"/>
				</FormField>

				<FormField caption={dict.domains} classes=".mt15" tooltip="project_domain">
					<Input 
						name="domain"
						value={data.domain || ''}
						placeholder={dict.domain_example}
						textarea/>
				</FormField>

				<FormField caption={dict.root} classes=".mt15" tooltip="project_root">
					<Radios 
						name="root" 
						value={data.root || '0'} 
						items={this.radios}/>
				</FormField>
			</Form>
		)
	}

	get radios() {
		return this.props.dict.root_options;
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