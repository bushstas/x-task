import React from 'react';
import {dict} from '../../utils/Dictionary';
import {get} from '../../utils/Fetcher';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Team from './Team';

import './index.scss';

export default class Users extends React.Component {
	constructor() {
		super();
		this.state = {
			data: {}
		}
	}

	componentDidMount() {
		get('load_users').then((data) => {
			this.setState({data});
		});
	}

	render() {
		let {data: {users}} = this.state;
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
				</div>
			</Loader>
		)
	}
}