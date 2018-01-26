import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Tooltip from '../../ui/Tooltip';

class TaskActions extends React.Component {

	componentDidMount() {
		this.props.doAction('TASKACTIONS_LOAD', this.props.id);
	}

	render() {
		let {dict} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClickMask}/>
				<Loader classes="content" fetching={!dict}>
					<div class="tooltip">
						<Tooltip dark>
							task_actions
						</Tooltip>
					</div>
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
		if (action == 'edit') {
			doAction('TASKACTIONS_EDIT', action);
		} else {
			doAction('TASKACTIONS_ACTION', action)
			.then(this.handleActionResult);
		}
		this.handleClickMask();
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

	handleClickMask = () => {
		this.props.dispatch('TASKACTIONS_INIT');
		this.props.doAction('MODALS_HIDE', 'task_actions');	
	}
}

let params = {
	has: 'taskactions',
	flat: true
}
export default Store.connect(TaskActions, params);