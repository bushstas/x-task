import React from 'react';
import {dict} from '../../utils/Dictionary';
import Loader from '../../ui/Loader';
import Store from 'xstore';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import {hasRight, inProject, isCurrentProject} from '../../utils/User';
import ActionButtons from '../ActionButtons';

import './index.scss';

class Projects extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD');
	}

	render() {
		let {fetching} = this.props;
	 	return (
	 		<Loader loaded={!fetching} classes="stretched">
				<div className="x-task-projects">
					{this.table}
					{this.actionButtons}
				</div>
			</Loader>
		)
	}

	get table() {		
		return (
			<Table
				headers={this.headers}
				widths={this.widths}
				rows={this.rows}/>
		)
	}

	get headers() {
		const headers = [
			dict.open_tasks,
			dict.participants,
			dict.main_page,
			dict.title			
		];
		if (hasRight('add_project')) {
			headers.push('');
		}
		headers.reverse();
		return headers;
	}

	get widths() {
		if (hasRight('add_project')) {
			return [2.5, 40, 33.5, 12, 12];
		}
		return [40, 36, 12, 12];
	}

	get rows() {
		let {projects} = this.props;
		const rows = [];
		let name, row;
		let index = 0;
		for (let p of projects) {
			row = [];
			if (hasRight('add_project')) {
				row.push(
					<Icon 
						classes="x-task-edit-icon x-task-button-icon" 
						data-index={index}
						onClick={this.handleEditProjectClick}>
						create
					</Icon>
				);
			}
			row.push(
				<div>
					{p.name}
					{isCurrentProject(p.token) ? (
						<Icon 
							classes="x-task-activate-icon x-task-button-icon" 
							style={{opacity: 0.2}}
							title={dict.current_project}>
							system_update_alt
						</Icon>
					) : (
					inProject(p.token) ? (
						<Icon 
							classes="x-task-activate-icon x-task-button-icon"
							title={dict.activate_project}>
							system_update_alt
						</Icon>
					) : 
						<Icon 
							classes="x-task-activate-icon x-task-button-icon"
							title={dict.request_access}>
							add_circle_outline
						</Icon>
					)}
				</div>,
				p.main_page || (
					<span className="x-task-gray">
						{dict.not_available}
					</span>
				),
				p.users_count,
				''
			);
			rows.push(row);
			index++;
		}
		return rows;
	}

	get actionButtons() {
		return (
			<ActionButtons 
				buttonsShown={this.shownButtons}
				onAction={this.handleAction}>
				
				<Button data-value="create">
					{dict.create_project}
				</Button>

				<Button data-value="add" width="100">
					{dict.add}
				</Button>

				<Button data-value="save"width="100">
					{dict.save}
				</Button>

				<Button classes="x-task-cancel-button" data-value="cancel" width="100">
					{dict.cancel}
				</Button>
			</ActionButtons>
		)
	}

	get shownButtons() {
		let {formShown} = this.props;
		if (formShown == 'edit') {
			return ['save', 'cancel'];
		}
		if (formShown == 'add') {
			return ['add', 'cancel'];
		}
		return ['create'];
	}

	handleEditProjectClick = () => {

	}	
}

const params = {
  has: 'projects',
  flat: true
}
export default Store.connect(Projects, params);