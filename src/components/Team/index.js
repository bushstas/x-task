import React from 'react';
import {dict} from '../../utils/Dictionary';
import {getToken, hasRight} from '../../utils/User';
import Table from '../../ui/Table';
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
		let {userFormShown, teamFetching} = this.props;
	 	if (userFormShown) {
	 		return this.form;
	 	}
	 	return (
	 		<Loader fetching={teamFetching}>
	 			{this.table}
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
		return ['', dict.name, dict.role, dict.projects];
	}

	get widths() {
		return [4, 31, 25, 40];
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
				<Icon
					classes="x-task-edit-icon x-task-button-icon"
					icon="edit"
					{...iconProps}/>,
				name,
				dict[u.role],
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