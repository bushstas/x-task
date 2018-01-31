import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import {addHandler, removeHandler} from '../../utils/EscapeHandler';

class ProjectsList extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD_LIST');
		addHandler(this.handleClose);
	}

	componentWillUnmount() {
		removeHandler(this.handleClose);
	}

	render() {
		let {dict} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
				<Loader classes="content" fetching={!dict}>					
					{this.buttons}
				</Loader>
			</div>
		)
	}

	get buttons() {
		let {actions, dict} = this.props;
		return (
			<div class="actions">
				{actions && actions.map((action) => {
					let {name, available} = action;
					return (
						<Button 
							key={name}
							value={name}
							onClick={this.handleAction}
							disabled={!available}>
							{dict[name]}
						</Button>
					)
				})}
			</div>
		)
	}

	handleAction = (action) => {
		let {doAction} = this.props;
		switch (action) {
			case 'edit':
				doAction('TASKACTIONS_EDIT', action);
			break;

			case 'assign':
				doAction('TASKACTIONS_ASSIGN', action);
			break;

			default:
				doAction('TASKACTIONS_ACTION', action)
				.then(this.handleActionResult);
		}
		this.handleClose();
	}

	handleActionResult = () => {
		let {loc, id, doAction} = this.props;
		if (loc == 'tasks') {
			doAction('TASKS_START_UPDATE');	
		} else if (loc == 'board') {
			doAction('BOARD_LOAD');
		}
		let modals = Store.getState('modals.modals');
		if (modals.task_info) {
			doAction('TASKINFO_LOAD', id);
		}
	}

	handleClose = () => {
		this.props.dispatch('TASKACTIONS_INIT');
		this.props.doAction('MODALS_HIDE', 'task_actions');	
	}
}

let params = {
	has: 'projects',
	flat: true
}
export default Store.connect(ProjectsList, params);