import React from 'react';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';

import './index.scss';

export default function MainMenu({onNavigate}) {
	return (
		<div className="x-task-main-menu" onClick={onNavigate}>
			<span data-name="my_account">
				{dict.my_account}
				<div>
					<Icon size="16">
						person
					</Icon>
				</div>
			</span>			
			<span data-name="tasks">
				{dict.tasks}
				<div>
					<Icon size="16">
						assignment_late
					</Icon>
				</div>
			</span>
			<span data-name="projects">
				{dict.projects}
				<div>
					<Icon size="16">
						layers
					</Icon>
				</div>
			</span>
			<span data-name="users">
				{dict.users}
				<div>
					<Icon size="16">
						people
					</Icon>
				</div>
			</span>
			<span data-name="logout">
				{dict.logout}
				<div>
					<Icon size="16">
						exit_to_app
					</Icon>
				</div>
			</span>
		</div>
	)
}