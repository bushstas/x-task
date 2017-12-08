import React from 'react';
import Form from '../../../ui/Form';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import FormField from '../../../ui/FormField';
import Checkboxes from '../../../ui/Checkboxes';
import {dict} from '../../../utils/Dictionary';
import Store from 'xstore';
import {isHead} from '../../../utils/User';

class UserForm extends React.Component {
	render() {
		let {userFormData: data} = this.props;
		return (
			<Form 
				data={data}
				onChange={this.handleFormChange}
				classes="pt10">

				<FormField caption={dict.login}>
					<Input name="login" value={data.login}/>
				</FormField>

				<FormField caption={dict.password} classes="mt15">
					<Input type="password" name="password" value={data.password}/>
				</FormField>

				<FormField caption={dict.password2} classes="mt15">
					<Input type="password" name="password2" value={data.password2}/>
				</FormField>

				<FormField caption={dict.name} classes="mt15">
					<Input name="userName" value={data.userName}/>
				</FormField>

				<FormField caption={dict.email} classes="mt15">
					<Input name="email" value={data.email}/>
				</FormField>

				<FormField caption={dict.role} classes="mt15">
					<Select name="role" value={data.role} options={this.roles}/>
				</FormField>

				<FormField caption={dict.projects} classes="mt15">
					<Checkboxes name="projects" value={data.projects} items={this.projects}/>
				</FormField>
			</Form>
		)
	}

	get roles() {
		const options = [];
		let {roles} = this.props;
		if (roles instanceof Array) {
			let idx = 0;
			for (let role of roles) {
				if (idx > 1 || (idx == 1 && isHead())) {
					options.push(role);
				}
				idx++;
			}
		}
		return options;
	}

	get projects() {
		let items = [];
		let {projects} = this.props;
		if (projects instanceof Array) {
			for (let p of projects) {
				items.push({value: p.token, label: p.name});
			}
		}
		return items;
	}

	handleFormChange = (data) => {
		this.props.dispatch('USERS_USER_FORM_DATA_CHANGED', data);
	}
}

const params = {
  has: 'users',
  flat: true
}
export default Store.connect(UserForm, params);