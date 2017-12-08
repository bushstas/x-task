import React from 'react';
import {dict} from '../../utils/Dictionary';
import {get} from '../../utils/Fetcher';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Team from './Team';
import ActionButtons from '../ActionButtons';

import './index.scss';

export default class Users extends React.Component {
	constructor() {
		super();
		this.state = {
			data: {},
			buttonsShown: ['create_user']
		}
	}

	componentDidMount() {
		get('load_users').then((data) => {
			this.setState({data});
		});
	}

	render() {
		let {data: {users}, buttonsShown, addingUser} = this.state;
	 	return (
	 		<Loader loaded={!!users} classes="stretched">
				<div className="x-task-users">
					<Tabs onSelect={this.handleSelectTab}>
						<Tab caption={dict.team} value="users">
							<Team 
								adding={addingUser}
								users={users}/>
						</Tab>
						<Tab caption={dict.invitations} value="invitations">
							2
						</Tab>
						<Tab caption={dict.roles} value="roles">
							3
						</Tab>
					</Tabs>
					<ActionButtons 
						buttonsShown={buttonsShown}
						onAction={this.handleAction}>
						
						<Button value="create_user">
							{dict.create_user}
						</Button>
					</ActionButtons>
				</div>
			</Loader>
		)
	}

	handleSelectTab = (value) => {
		let buttonsShown = [];
		switch (value) {
			case 'users':
				buttonsShown.push('create_user');
			break;
		}
		this.setState({buttonsShown});
	}

	handleAction = (action) => {
		switch (action) {
			case 'create_user': {
				this.setState({addingUser: true});
			}
		}
	}
}