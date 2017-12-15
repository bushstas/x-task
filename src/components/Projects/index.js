import React from 'react';
import {dict} from '../../utils/Dictionary';
import Loader from '../../ui/Loader';
import Store from 'xstore';
import Table from '../../ui/Table';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import ProjectForm from '../ProjectForm';
import {hasRight, inProject} from '../../utils/User';
import ActionButtons from '../ActionButtons';

import './index.scss';

class Projects extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD');
	}

	render() {
		let {fetching, formShown} = this.props;
		if (formShown) {
			return [
				this.form,
				this.actionButtons
			]
		}
	 	return (
	 		<Loader fetching={fetching} classes=".projects">
				{this.table}
				{this.actionButtons}
			</Loader>
		)
	}

	get form() {
		return <ProjectForm key="form"/>
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
			return [4, 40, 32, 12, 12];
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
						icon="edit"
						classes="icon::edit icon::button" 
						data-index={index}
						onClick={this.handleEditProjectClick}/>
				);
			}
			row.push(
				<div>
					{p.name}
					{this.renderActionIcon(index, p)}
				</div>,
				p.homepage || (
					<span class=".gray">
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

	renderActionIcon(index, data) {
		return data.current ? (
			<Icon 
				icon="activate"
				classes="icon::activate icon::button" 
				style={{opacity: 0.2}}
				title={dict.current_project}/>
		) : (
		inProject(data.token) ? (
			<Icon 
				icon="activate"
				classes="icon::activate icon::button"
				title={dict.activate_project}
				data-index={index}
				onClick={this.handleActivateButtonClick}/>
		) : 
			this.renderRequestAccessIcon(index, data)
		)
	}

	renderRequestAccessIcon(index, data) {
		let props = {
			icon: 'access',
			classes: 'icon::activate  icon::button'
		};
		if (data.requested == 1) {
			props.title = dict.access_requested;
			props.style = {opacity: 0.2};
		} else {
			props.title = dict.request_access;
			props['data-index'] = index;
			props.onClick = this.handleRequestAccessClick;
		}
		return (
			<Icon {...props}/>
		)
	}

	get actionButtons() {
		let {editedProject} = this.props;
		return (
			<ActionButtons 
				key="actionButtons"
				buttonsShown={this.shownButtons}
				onAction={this.handleAction}>
				
				<Button data-value="create">
					{dict.create_project}
				</Button>

				<Button data-value="add" width="100">
					{dict.add}
				</Button>

				<Button data-value="save" width="100" data-token={editedProject}>
					{dict.save}
				</Button>

				<Button classes=".cancel-button" data-value="cancel" width="100">
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

	getProject(e) {
		let index = e.target.getAttribute('data-index');
		let {projects} = this.props;
		return projects[index];
	}

	getProjectToken(e) {
		let project = this.getProject(e);
		if (project instanceof Object && project.token) {
			return project.token;
		}
	}

	handleEditProjectClick = (e) => {
		let token = this.getProjectToken(e);
		if (token) {
			this.props.doAction('PROJECTS_SHOW_EDIT_FORM', token);
		}
	}

	handleRequestAccessClick = (e) => {
		let token = this.getProjectToken(e);
		if (token) {
			this.props.doAction('PROJECTS_REQUEST_ACCESS', token);
		}
	}

	handleActivateButtonClick = (e) => {
		let project = this.getProject(e);
		if (project instanceof Object && project.token) {
			this.props.doAction('PROJECTS_ACTIVATE', project);
		}
	} 

	handleAction = (action, data) => {
		switch (action) {
			case 'cancel': 
				return this.props.dispatch('PROJECTS_CANCELED');

			case 'create': 
				return this.props.dispatch('PROJECTS_ADD_FORM_SHOWN');
			
			case 'save': 
				return this.props.doAction('PROJECTS_SAVE', data);

			case 'add': 
				let {formData} = this.props;
				return this.props.doAction('PROJECTS_ADD', userFormData);
			
		}
	}
}

const params = {
  has: 'projects',
  flat: true
}
export default Store.connect(Projects, params);