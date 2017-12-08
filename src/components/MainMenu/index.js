import React from 'react';
import {dict} from '../../utils/Dictionary';

import './index.scss';

export default function MainMenu({onNavigate}) {
	return (
		<div className="x-task-main-menu" onClick={onNavigate}>
			<span data-name="my_account">
				{dict.my_account}
			</span>			
			<span data-name="tasks">
				{dict.tasks}
			</span>
			<span data-name="projects">
				{dict.projects}
			</span>
			<span data-name="users">
				{dict.users}
			</span>
			<span data-name="logout">
				{dict.logout}
			</span>
		</div>
	)
}