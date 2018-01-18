import React from 'react';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormField from '../../ui/FormField';
import Checkbox from '../../ui/Checkbox';
import Radios from '../../ui/Radios';
import Store from 'xstore';
import {isCurrentProject} from '../../utils/User';

class ProjectForm extends React.Component {
	render() {
		let {formData: data, editedProject, dict} = this.props;
		let isOnProject = isCurrentProject(editedProject);
		let {nohashes, noparams, measure} = data;
		if (nohashes == 0) {
			nohashes = false;
		}
		if (noparams == 0) {
			noparams = false;
		}
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

				<FormField caption={dict.roots} classes=".mt15" tooltip="project_roots">
					<Input 
						name="roots"
						value={data.roots || ''}
						placeholder={dict.roots_example}
						textarea/>
				</FormField>

				<FormField caption={dict.settings} classes="settings .mt15" tooltip="project_settings">
					<Checkbox 
						checked={nohashes}
						name="nohashes">
						{dict.nohashes}
					</Checkbox>

					<Checkbox 
						checked={noparams}
						name="noparams">
						{dict.noparams}
					</Checkbox>

					{noparams && (
						<Input
						 	name="getparams"
						 	value={data.getparams}
						 	classes="getparams"
						 	placeholder={dict.getparams}
						 	textarea/>
					)}
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