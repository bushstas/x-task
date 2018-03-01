import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Dialog from '../../ui/Dialog';

import TaskInfo from '../TaskInfo';
import TaskActions from '../TaskActions';
import ProjectsList from '../ProjectsList';
import WorkStatuses from '../WorkStatuses';
import QuickCall from '../QuickCall';
import UserInfo from '../UserInfo';

class Modals extends React.Component {	
	componentDidMount() {
		window.addEventListener('keydown', this.handleMouseDown, false);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleMouseDown, false);	
	}

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

			case 'user_info':
				dialog = (
					<UserInfo 
						key="user_info"
						id={data.id}
						name={data.name}/>
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

	
	handleMouseDown = ({keyCode}) => {
		if (keyCode == 27) {
			const {modals} = this.props;
			const keys = Object.keys(modals);
			const name = keys[keys.length - 1];
			if (name) {
				this.handleClose(name);
			}
		}
	}
}

export default Store.connect(Modals, 'modals');