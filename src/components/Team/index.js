import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import User from '../User';
import Icon from '../../ui/Icon';
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
	 					onTaskClick={this.handleTaskClick}
	 					onClick={this.handleUserClick}
	 				/>
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

	handleStatusClick = (id) => {
		this.props.doAction('MODALS_SHOW', {name: 'work_statuses', props: {id}});
	}

	handleTaskClick = (id) => {
		const props = {id};
		this.props.doAction('TASKINFO_CHANGE', props);
		this.props.doAction('MODALS_SHOW', {name: 'task_info', props});
	}

	handleUserClick = (id, name) => {
		this.props.doAction('MODALS_SHOW', {name: 'user_info', props: {id, name}});
	}
}

export default Store.connect(Team, 'team');