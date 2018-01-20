import React from 'react';
import {dict} from '../../utils/Dictionary';
import {getToken, hasRight} from '../../utils/User';
import User from '../User';
import Icon from '../../ui/Icon';
import UserForm from '../UserForm';
import Store from 'xstore';
import Loader from '../../ui/Loader';

class Team extends React.Component {
	static defaultProps = {
		onStartEdit: () => {}
	}

	componentDidMount() {
		this.props.doAction('TEAM_LOAD');
	}

	render() {
		let {userFormShown, teamFetching, users} = this.props;
	 	if (userFormShown) {
	 		return this.form;
	 	}
	 	return (
	 		<Loader classes="self" fetching={teamFetching}>
	 			{users.map((user) => {
	 				return (
	 					<User data={user} key={user.token}/>
	 				)
	 			})}
	 		</Loader>
	 	)
	}

	get form() {
		return <UserForm/>
	}

	get table() {
		return (
			<Table
				headers={this.headers}
				widths={this.widths}
				rows={this.rows}/>
		)
	}

	get headers() {
		let headers = [dict.name, dict.role, dict.projects];
		if (this.canEdit) {
			headers.unshift('');
		}
		return headers;
	}

	get widths() {
		if (this.canEdit) {
			return [4, 31, 25, 40];
		}
		return [35, 25, 40];
	}

	get canEdit() {
		return hasRight('edit_user');
	}

	get rows() {
		let {users} = this.props,
			rows = [], name, canEdit,
			token = getToken(),
			i, placeholder, iconProps;
		
		let index = 0;
		for (let u of users) {
			name = u.name;
			let projects;
			if (!u.projects) {
				projects = (
					<span class=".gray">
						{dict.nothave}
					</span>
				)
			} else {
				projects = u.projects.split(',').join(', ');
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
						<div class=".user-blocked">
							{dict.blocked}: <span>{u.blockedBy}</span>
						</div>
					</div>
				)
			}
			let role;
			if (u.spec) {
				role = dict[u.spec];
			} else {
				role = dict[u.role];
			}
			let row = [
				name,
				role,
				projects
			];
			if (this.canEdit) {
				row.unshift(
					<Icon
						classes="icon::edit icon::button"
						icon="edit"
						{...iconProps}/>
				);
			}
			rows.push(row);
			index++;
		}
		return rows;
	}

	handleEditUserClick = (e) => {
		let index = e.target.getAttribute('data-index');
		if (index) {
			let {users} = this.props;
			let user = users[index];
			if (user instanceof Object && user.token) {			
				this.props.doAction('TEAM_SHOW_EDIT_FORM', user.token);
			}
		}
	}
}

const params = {
  has: 'team',
  flat: true
}
export default Store.connect(Team, params);