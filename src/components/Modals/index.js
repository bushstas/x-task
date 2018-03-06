import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Dialog from '../../ui/Dialog';

import TaskInfo from '../TaskInfo';
import TaskActions from '../TaskActions';
import UserActions from '../UserActions';
import ProjectsList from '../ProjectsList';
import WorkStatuses from '../WorkStatuses';
import QuickCall from '../QuickCall';
import UserInfo from '../UserInfo';
import UserForm from '../UserForm';

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
					classes: $classy('.dialog-large .dialog-no-overflow'),
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

			case 'user_form':
				const {id} = data;
				dialog = this.renderThisModal({
					classes: $classy('.dialog-large'),
					name: key,
					title: dict[id ? 'user_editing' : 'user_adding'],
					content: <UserForm id={id}/>
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

			case 'user_actions':
				dialog = (
					<UserActions 
						id={data.id}  
						loc={data.loc} 
						key="useractions"/>
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
				dialog = this.renderThisModal({
					classes: $classy('.dialog-large'),
					name: key,
					title: data.name,
					content: <UserInfo id={data.id}/>
				});
			break;
		}
		return dialog;
	}

	renderThisModal = (params) => {
		const {name, title, content, classes} = params;
		const props = {
			classes,
			key: name,
			name, 
			title,
			onClose: this.handleClose,
			clickMaskToClose: true,
			children: content
		};
		return <Dialog {...props}/>
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