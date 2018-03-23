import React from 'react';
import Store from 'xstore';
import Dialog from '../../ui/Dialog';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button'
import Task from '../Task';

class UserTasks extends React.Component {

	componentDidMount() {
		this.props.doAction('USERACTIONS_LOAD_TASKS');
	}

	render() {
		let {tasks} = this.props;
		return (
			<Loader classes="self" fetching={!tasks}>
				{this.appropriateTasks}
				{this.otherTasks}
			</Loader>
		)
	}

	get appropriateTasks() {
		const {tasks, dict} = this.props;
		if (!tasks || tasks.length == 0) {
			return;
		}
		return this.renderTasks(tasks, dict.appropriate, dict);
	}

	get otherTasks() {
		const {otherTasks, dict} = this.props;
		if (!otherTasks || otherTasks.length == 0) {
			return;
		}
		return this.renderTasks(otherTasks, dict.inappropriate, dict);
	}

	renderTasks(tasks, title, dict) {
		return (
			<div class="block">
				<div class="title">
					{title}
				</div>
				{tasks.map((task, i) => {
					return (
						<Task 
							data={task}
							key={task.id}
							onClick={this.handleTaskClick}
						>
							<Button classes="see" value={task.id} onClick={this.handleTaskViewClick}>
								{dict.view}
							</Button>
						</Task>
					)
				})}
			</div>
		)
	}

	handleTaskClick = (id) => {
		this.props.doAction('USERACTIONS_ASSIGN_TASK', id);
	}

	handleTaskViewClick = (id) => {
		this.props.doAction('USERACTIONS_SHOW_TASK_INFO', {id});
	}
}

export default Store.connect(UserTasks, 'useractions');