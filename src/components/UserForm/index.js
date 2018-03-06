import React from 'react';
import Form from '../../ui/Form';
import Loader from '../../ui/Loader';
import Avatar from '../../components/Avatar';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import FormField from '../../ui/FormField';
import Checkboxes from '../../ui/Checkboxes';
import FormSubmit from '../../ui/FormSubmit';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import {isHead, isCurrentUser} from '../../utils/User';

class UserForm extends React.Component {
	render() {
		const {userFormData: data, id} = this.props;
		const fetching = id && !data.login;
		return (
			<Loader classes="self .pt10" fetching={fetching}>
				{!fetching && this.form}
			</Loader>
		)
	}

	get form() {
		const {userFormData: data} = this.props;
		return (
			<div>
				<Avatar
					id={data.avatar_id}
					userName={data.userName}
					userId={data.id}/>
				<Form 
					data={data}
					onChange={this.handleFormChange}
					onSubmit={this.handleSubmit}>

					<FormField caption={dict.login}>
						<Input name="login" value={data.login}/>
					</FormField>

					<FormField caption={dict.password} classes=".mt15">
						<Input type="password" name="password" value={data.password}/>
					</FormField>

					<FormField caption={dict.password2} classes=".mt15">
						<Input type="password" name="password2" value={data.password2}/>
					</FormField>

					<FormField caption={dict.name} classes=".mt15">
						<Input name="userName" value={data.userName}/>
					</FormField>

					<FormField caption={dict.email} classes=".mt15">
						<Input name="email" value={data.email}/>
					</FormField>

					<FormField caption={dict.role} classes=".mt15">
						<Select name="role" value={data.role} options={this.roles}/>
					</FormField>

					<FormField caption={dict.spec} classes=".mt15">
						<Select name="spec" value={data.spec} options={this.specs}/>
					</FormField>

					<FormField caption={dict.projects} classes=".mt15">
						<Checkboxes name="projects" value={data.projects} items={this.projects}/>
					</FormField>

					<div class="submit">
						<FormSubmit>
							<Icon icon="save"/> {dict.save}
						</FormSubmit>
					</div>
				</Form>
			</div>
		)
	}

	get roles() {
		const options = [
			{value: '', name: dict.pick_role}
		];
		let {roles} = this.props;
		if (roles instanceof Array) {
			let idx = 0;
			for (let role of roles) {
				if (idx > 1 || (idx == 1 && isHead())) {
					options.push({value: role.id, name: dict[role.code]});
				}
				idx++;
			}
		}
		return options;
	}

	get projects() {
		const items = [];
		let {projects} = this.props;
		if (projects instanceof Array) {
			for (let p of projects) {
				items.push({value: p.token, label: p.name});
			}
		}
		return items;
	}

	get specs() {
		const options = [
			{value: '', name: dict.pick_spec}
		];
		let {specs} = this.props;
		if (specs instanceof Array) {
			for (let spec of specs) {
				options.push({value: spec.id, name: dict[spec.code]});
			}
		}
		return options;
	}

	handleFormChange = (data) => {
		this.props.dispatch('TEAM_FORM_DATA_CHANGED', data);
	}

	handleSubmit = () => {
		if (this.props.id) {
			this.props.doAction('TEAM_SAVE_USER', this.props.id);
		} else {
			this.props.doAction('TEAM_CREATE_USER');
		}
	}
}

export default Store.connect(UserForm, 'team');