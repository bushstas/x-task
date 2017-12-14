import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Task from '../Task';
import ActionButtons from '../ActionButtons';
import Store from 'xstore'

import './index.scss';

class Tasks extends React.Component {

	componentDidMount() {
		this.props.doAction('TASKS_LOAD');
	}

	render() {
		let {fetching} = this.props;
	 	return (
	 		<Loader fetching={fetching} classes=".tasks">
				{this.tasks}
				{this.actionButtons}
			</Loader>
		)
	}

	get tasks() {
		let {tasks} = this.props;
		if (tasks instanceof Array && tasks.length > 0) {
			return tasks.map((task, i) => {
				return (
					<Task data={task} key={i}/>
				)
			});
		}
		return this.noTasks;
	}

	get noTasks() {
		return (
			<div class=".no-tasks">
				{dict.no_tasks}
			</div>
		)
	}


	get actionButtons() {
		let {editedUserToken} = this.props;
		return (
			<ActionButtons 
				buttonsShown={this.shownButtons}
				onAction={this.handleAction}>
				
				<Button data-value="create_user">
					{dict.create_user}
				</Button>

			</ActionButtons>
		)
	}

	get shownButtons() {
		let {activeTab} = this.props;
		switch (activeTab) {
			case 'users': {
				return ['create_user'];
			}
		}
		return [];
	}

	handleSelectTab = (activeTab) => {
		
	}

	handleAction = (action, data) => {
		switch (action) {
			case 'cancel': 
				return this.props.dispatch('USERS_CANCELED');

			case 'create_user': 
				return this.props.dispatch('USERS_ADDING_USER_FORM_SHOWN');
			
			case 'save_user': 
				return this.props.doAction('USERS_SAVE_USER', data);
			
		}
	}
}

const params = {
  has: 'tasks',
  flat: true
}
export default Store.connect(Tasks, params);