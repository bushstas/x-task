import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';

import './index.scss';

export default class Users extends React.Component {
	render() {
	 	return (
			<div className="x-task-users">
				<Tabs>
					<Tab caption={dict.team}>
						1
					</Tab>
					<Tab caption={dict.invitations}>
						2
					</Tab>
					<Tab caption={dict.roles}>
						3
					</Tab>
				</Tabs>
			</div>
		)
	}
}