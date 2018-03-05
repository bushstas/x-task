import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import {getRoleId} from '../../utils/User';
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
			task_id,
			project_name,
			task_counts,
			actions
		}} = this.props;

		if (!projects) {
			projects = (
				<span class=".gray">
					{dict.nothave}
				</span>
			)
		} else if (projects == '*') {
			projects = dict.all_projects;
		} else {
			let ps = projects.split(',');
			projects = [];			
			for (let pr of ps) {
				projects.push(
					<span class="user-project $pr==project_name?active" key={pr}>
						{pr}
					</span>
				);
			}
		}
		let userClass = $classy(role, '.role-', ['head', 'admin', 'editor', 'analyst']);
		

		if (task) {
			task = (
				<span class="task-link" onClick={this.handleTaskClick} data-value={task_id}>
					{task}
				</span>
			)
		} else {
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
					{this.status}
				</div>
				{role != 'head' && (
					<div class="projects">
						<div class="title">
							{dict.projects}
						</div>
						<div class="title tasks">
							{dict.tasks} 
							<span>
								{task_counts.own} / {task_counts.available}
							</span>
						</div>
						<div class="projects-list">
							{projects}
						</div>
					</div>
				)}
				{role != 'head' && (
					<div class="data">
						<div class="title">
							{dict.current_task}
						</div>
						{project_name && (
							<span class="current-project">
								{project_name}
							</span>
						)}
						<div class="task">
							{task}
						</div>
					</div>
				)}
				{actions && (
					<ActionsButton 
						id={id}
						loc="team"
						name="user_actions"/>
				)}
			</div>
		)
	}

	get status() {
		const {data: {status, work_status_id, role_id}} = this.props;
		let statusClass = $classy(work_status_id, 'status-', [1, 2, 3, 4, 5, 6]);
		const ownRoleId = getRoleId();
		if (ownRoleId <= role_id) {
			return (
				<div class="status .pointer $statusClass" onClick={this.handleStatusClick} title={dict.edit_status}>
					{status}
				</div>
			)	
		}
		return (
			<div class="status $statusClass">
				{status}
			</div>
		)
	}

	handleClick = () => {
		
	}

	handleTaskClick = (e) => {
		e.stopPropagation();
		const {target: {dataset: {value}}} = e;
		if (value) {
			this.props.onTaskClick(value);
		}
	}

	handleStatusClick = (e) => {
		e.stopPropagation();
		let {data: {id}} = this.props;
		this.props.onStatusClick(id);
	}
}