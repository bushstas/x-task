import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Tooltip from '../../ui/Tooltip';

class TaskActions extends React.Component {
	static defaultProps = {
		onClose: () => {},
		onAction: () => {}
	}

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
		let {loc, id, doAction} = this.props;
		if (action == 'edit') {
			doAction('TASKACTIONS_EDIT', action);
		} else {
			doAction('TASKACTIONS_ACTION', action)
			.then(data => {
				if (loc == 'tasks' || loc == 'task_info') {
					doAction('TASKS_START_UPDATE');	
				}
				if (loc == 'task_info') {
					let index = Store.getState('tasks.shownTaskIndex');			    
			    	if (typeof index == 'number') {
			      		doAction('TASKINFO_LOAD', id);
			    	}
			    }
			});
		}
		this.handleClickMask();
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