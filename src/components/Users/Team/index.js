import React from 'react';
import {dict} from '../../../utils/Dictionary';
import {getToken, hasRight} from '../../../utils/User';
import Table from '../../../ui/Table';
import Icon from '../../../ui/Icon';

export default class Team extends React.Component {
	render() {
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
			i, placeholder, icon, iconProps;
		
		for (let u of users) {
			name = u.name;
			if (!u.projects) {
				u.projects = dict.nothave;
			}			
			canEdit = token == u.token || (u.role != 'head' && (hasRight('edit_admin') || (u.role != 'admin' && hasRight('edit_user'))));
			
			
			if (canEdit) {
				iconProps = {
					'data-token': u.token,
					'data-blocked': u.blockedBy ? 1 : 0,
					onClick: this.handleEditUserClick
				};
			} else {
				iconProps = {
					style: {
						opacity: 0.2
					}
				};
			}
			icon = (
				<Icon classes="x-task-edit-icon" {...iconProps}>
					create
				</Icon>
			);
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
				icon,
				name,
				u.roleName,
				u.projects.split(',').join(', ')
			]);
		}
		return rows;
	}
}