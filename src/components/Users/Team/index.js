import React from 'react';
import {dict} from '../../../utils/Dictionary';
import {getToken, hasRight} from '../../../utils/User';
import Table from '../../../ui/Table';
import Icon from '../../../ui/Icon';
import UserForm from '../UserForm';

export default class Team extends React.Component {
	constructor() {
		super();
		this.state = {
			formShown: false,
			editedUser: null
		}
	}

	render() {
		let {formShown, editedUser} = this.state;
	 	if (formShown) {
	 		return (
	 			<UserForm 
	 				data={editedUser}
	 				onSubmit={this.handleUserFormSubmit}/>
	 		)
	 	}
	 	return (
			<Table
				headers={this.headers}
				widths={this.widths}
				rows={this.rows}/>
		)
	}

	get headers() {
		return ['', 'Имя', 'Роль', 'Проекты'];
	}

	get widths() {
		return [2.5, 32.5, 25, 40];
	}

	get rows() {
		let {users} = this.props,
			token = getToken(),
			rows = [], name, canEdit,
			i, placeholder, iconProps;
		
		let index = 0;
		for (let u of users) {
			name = u.name;
			if (!u.projects) {
				u.projects = dict.nothave;
			}			
			canEdit = token == u.token || (u.role != 'head' && (hasRight('edit_admin') || (u.role != 'admin' && hasRight('edit_user'))));
			
			
			if (canEdit) {
				iconProps = {
					'data-index': index,
					onClick: this.handleEditUserClick
				};
			} else {
				iconProps = {
					style: {
						opacity: 0.2
					}
				};
			}
			if (u.blockedBy) {
				name = (
					<div>
						{name}
						<div className="x-task-user-blocked">
							Заблокирован: <span>{u.blockedBy}</span>
						</div>
					</div>
				)
			}
			rows.push([
				<Icon classes="x-task-edit-icon" {...iconProps}>
					create
				</Icon>,
				name,
				u.roleName,
				u.projects.split(',').join(', ')
			]);
			index++;
		}
		return rows;
	}

	handleEditUserClick = (e) => {
		let index = e.target.getAttribute('data-index');
		if (index) {
			let {users} = this.props;
			let user = users[index];
			this.setState({formShown: true});
			
		}
	}

	handleUserFormSubmit = (data) => {

	}
}