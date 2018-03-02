import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Tooltip from '../../ui/Tooltip';
import {dict as dictionary} from '../../utils/Dictionary';

class UserActions extends React.Component {

	componentDidMount() {
		this.props.doAction('USERACTIONS_LOAD', this.props.id);
	}

	render() {
		let {dict} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
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
		let {actions, dict, removeClicked} = this.props;
		return (
			<div class="actions">
				{actions && actions.map((action) => {
					let {name, available} = action;
					const caption = removeClicked && name == 'remove' ? dictionary.no : dict[name];
					return (
						<div class="button-container" key={name}>
							<Button 
								value={name}
								onClick={this.handleAction}
								disabled={!available}>
								{caption}
							</Button>
							{removeClicked && name == 'remove' && (
								<Button 
									classes="confirm"
									onClick={this.handleRemoveAction}>
									{dictionary.yes}
								</Button>
							)}
						</div>
					)
				})}
			</div>
		)
	}

	handleAction = (action) => {
		let {doAction, removeClicked} = this.props;
		switch (action) {
			case 'edit':
				doAction('USERACTIONS_EDIT', action);
			break;

			case 'assign':
				doAction('USERACTIONS_ASSIGN', action);
			break;

			case 'remove':
				return doAction('USERACTIONS_REMOVE', !removeClicked);

			default:
				doAction('USERACTIONS_ACTION', action)
				.then(this.handleActionResult);
		}
		this.handleClose();
	}

	handleRemoveAction = () => {
		this.props.doAction('USERACTIONS_ACTION', 'remove')
		.then(this.handleTaskRemove);
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

	handleTaskRemove = () => {
		this.props.doAction('MODALS_HIDE', 'task_info');
		this.handleActionResult();
	}

	handleClose = () => {
		this.props.dispatch('USERACTIONS_INIT');
		this.props.doAction('MODALS_HIDE', 'task_actions');	
	}
}

export default Store.connect(UserActions, 'useractions');