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
import {isHead} from '../../utils/User';

class UserForm extends React.Component {
	
	componentDidMount() {
		this.props.doAction('USERFORM_LOAD', this.props.id);
	}

	componentWillUnmount() {
		this.props.doAction('USERFORM_DISPOSE');
	}

	render() {
		const {fetching} = this.props;
		return (
			<Loader classes="self" fetching={fetching}>
				{!fetching && this.form}
			</Loader>
		)
	}

	get form() {
		const {data, roles, specs, projects} = this.props;
		return (
			<div>
				<Avatar
					id={data.avatar_id}
					userName={data.userName}
					userId={data.id}
					onClick={this.handleAvatarClick}/>
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
						<Select name="role" value={data.role} options={roles}/>
					</FormField>

					<FormField caption={dict.spec} classes=".mt15" hidden={data.role != 6}>
						<Select name="spec" value={data.spec} options={specs}/>
					</FormField>

					<FormField caption={dict.projects} classes=".mt15" hidden={!data.role || data.role < 4}>
						<Checkboxes name="projects" value={data.projects} items={projects}/>
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

	handleFormChange = (data) => {
		this.props.doAction('USERFORM_CHANGE', {data});
	}

	handleAvatarClick = () => {
		this.props.doAction('USERFORM_SHOW_AVATARS');	
	}

	handleSubmit = () => {
		this.props.doAction(this.props.id ? 'USERFORM_SAVE_USER' : 'USERFORM_CREATE_USER');
	}
}

export default Store.connect(UserForm, 'userform');