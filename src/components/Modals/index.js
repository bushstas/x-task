import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Dialog from '../../ui/Dialog';

import TaskInfo from '../TaskInfo';
import TaskActions from '../TaskActions';
import ProjectsList from '../ProjectsList';
import WorkStatuses from '../WorkStatuses';
import QuickCall from '../QuickCall';

class Modals extends React.Component {	
	render() {
		let {modals} = this.props;
		return (
			<div class="self">
				{Object.keys(modals).map(this.renderModal)}
			</div>
		)	
	}

	renderModal = (key) => {
		let {modals} = this.props;
		let data = modals[key];
		let dialog;
		switch (key) {			
			case 'task_info':
				dialog = this.renderThisModal({
					name: key,
					title: dict.task_inf,
					content: (
						<TaskInfo 
							id={data.id}
							tasksCount={data.tasksCount}
							index={data.index}
							store={data.store}
							key="taskinfo"/>
					)
				});
			break;

			case 'task_actions':
				dialog = (
					<TaskActions 
						id={data.id}  
						loc={data.loc} 
						key="taskactions"/>
				)
			break;

			case 'projects_list':
				dialog = (
					<ProjectsList 
						key="projectslist"
						store={data.store}/>
				)
			break;

			case 'work_statuses':
				dialog = (
					<WorkStatuses 
						key="workstatuses"
						id={data.id}/>
				)
			break;

			case 'quick_call':
				dialog = (
					<QuickCall key="quick_call"/>
				)
			break;
		}
		return dialog;
	}

	renderThisModal = (params) => {
		let {name, title, content} = params;
		let props = {
			key: name,
			name, 
			title,
			onClose: this.handleClose,
			clickMaskToClose: true
		};
		return (
			<Dialog classes="~large ~no-overflow" {...props}>
				{content}
			</Dialog>
		)
	}

	handleClose = (name) => {
		this.props.doAction('MODALS_HIDE', name);
	}
}

export default Store.connect(Modals, 'modals');