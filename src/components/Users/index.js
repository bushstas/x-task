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
			buttonsShown: ['add_user']
		}
	}

	componentDidMount() {
		get('load_users').then((data) => {
			this.setState({data});
		});
	}

	render() {
		let {data: {users}, buttonsShown} = this.state;
	 	return (
	 		<Loader loaded={!!users} classes="stretched">
				<div className="x-task-users">
					<Tabs>
						<Tab caption={dict.team}>
							<Team users={users}/>
						</Tab>
						<Tab caption={dict.invitations}>
							2
						</Tab>
						<Tab caption={dict.roles}>
							3
						</Tab>
					</Tabs>
					<ActionButtons buttonsShown={buttonsShown}>
						<Button value="add_user">
							{dict.create_user}
						</Button>
					</ActionButtons>
				</div>
			</Loader>
		)
	}
}