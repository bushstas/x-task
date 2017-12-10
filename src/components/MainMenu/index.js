import React from 'react';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import classnames from 'classnames';

import './index.scss';

export default function MainMenu({active, onNavigate}) {
	return (
		<div className="x-task-main-menu" onClick={onNavigate}>
			<span className={classnames(active == 'my_account' ? 'active' : '')} data-name="my_account">
				{dict.my_account}
				<div>
					<Icon size="16">
						person
					</Icon>
				</div>
			</span>			
			<span className={classnames(active == 'tasks' ? 'active' : '')} data-name="tasks">
				{dict.tasks}
				<div>
					<Icon size="16">
						assignment_late
					</Icon>
				</div>
			</span>
			<span className={classnames(active == 'projects' ? 'active' : '')} data-name="projects">
				{dict.projects}
				<div>
					<Icon size="16">
						layers
					</Icon>
				</div>
			</span>
			<span className={classnames(active == 'users' ? 'active' : '')} data-name="users">
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