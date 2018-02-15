import React from 'react';
import User from '../User';
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

export default Store.connect(Team, 'team');