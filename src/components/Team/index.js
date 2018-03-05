import React from 'react';
import User from '../User';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
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
		let { teamFetching, users} = this.props;
	 	return (
	 		<Loader classes="self" fetching={teamFetching}>
	 			{users && this.users}
	 		</Loader>
	 	)
	}

	get users() {
		let {users} = this.props;
		if (users.length > 0) {
			return users.map((user) => {
	 			return (
	 				<User 
	 					data={user}
	 					key={user.token}
	 					onStatusClick={this.handleStatusClick}
	 					onTaskClick={this.handleTaskClick}/>
	 			)
	 		});
	 	}
		return this.noUsers;
	}

	get noUsers() {
		return (
			<div class="no-users">
				<Icon icon="sad"/>
				<div class="no-users-text">
					{dict.no_users}
				</div>
			</div>
		)
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

	handleStatusClick = (id) => {
		this.props.doAction('MODALS_SHOW', {name: 'work_statuses', props: {id}});
	}

	handleTaskClick = (id) => {
		this.props.doAction('TASKINFO_CHANGE', {id});
		this.props.doAction('MODALS_SHOW', {name: 'task_info'});
	}
}

export default Store.connect(Team, 'team');