import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import ActionsButton from '../ActionsButton';

export default class User extends React.Component {
	

	render() {
		let {data: {
			name,
			avatar_id,
			id, 
			role,
			spec,
			projects,
			task,
			status,
			work_status_id
		}} = this.props;

		if (!projects) {
			projects = (
				<span class=".gray">
					{dict.nothave}
				</span>
			)
		} else {
			projects = projects.split(',').join(', ');
		}
		let userClass = $classy(role, '.role-', ['head', 'admin', 'editor', 'analyst']);
		let statusClass = $classy(work_status_id, 'status-', [1, 2, 3, 4, 5, 6]);

		if (!task) {
			task = (
				<span class=".gray">
					{dict.none}
				</span>
			)
		}
		return (
			<div class="self $userClass" onClick={this.handleClick}>
				<Avatar 
					id={avatar_id}
					userId={id}
					userName={name}/>
				<div class="main-info">
					<div class="name">
						{name}
					</div>
					<div class="role">
						{dict[spec || role]}
					</div>
					<div class="status $statusClass">
						{status}
					</div>
				</div>
				<div class="projects">
					<div class="title">
						{dict.projects}
					</div>
					<div class="projects-list">
						{projects}
					</div>
				</div>
				<div class="data">
					<div class="title">
						{dict.current_task}
					</div>
					<div class="task">
						{task}
					</div>
				</div>
				{true && (
					<ActionsButton onClick={this.handleActionsClick}/>
				)}
			</div>
		)
	}

	handleClick = () => {
		
	}
}