import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Task from '../Task';
import Store from 'xstore';
import {getRole} from '../../utils/User';

class Tasks extends React.Component {

	componentDidMount() {
		this.props.doAction('TASKS_LOAD');
	}

	render() {
		let {fetching, filter, status} = this.props;
		let role = getRole();
	 	return (
	 		<div class="self">
		 		{role != 'observer' && (
		 			<Tabs 
						classes="main-tabs"
			 			onSelect={this.handleSelectTab}
			 			value={filter}
			 			simple>
			 			{this.firstTab}
			 			{this.secondTab}
			 			{this.thirdTab}
					</Tabs>
				)}
				<Tabs 
					classes="statuses"
					onSelect={this.handleSelectStatusTab}
					value={status}
					simple>
		 			<Tab caption={dict.all} value="all"/>
		 			<Tab caption={dict.status_ready} value="ready"/>
		 			<Tab caption={dict.status_in_work} value="in_work"/>
		 			<Tab caption={dict.status_none} value="none"/>
				</Tabs>
		 		<Loader fetching={fetching} classes="content">
					{this.tasks}
				</Loader>
			</div>
		)
	}

	get firstTab() {
		let role = getRole();
		let caption = role == 'developer'  ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role == 'developer' ? 'forme' : 'fromme';
		return (
			<Tab caption={caption} value={value}/>
		)
	}

	get secondTab() {
		let role = getRole();
		let caption = role != 6 ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role != 6 ? 'forme' : 'fromme';
		return (
			<Tab caption={caption} value={value}/>
		)
	}

	get thirdTab() {
		return (
			<Tab caption={dict.all_tasks} value="all"/>
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

	handleSelectTab = (filter) => {
		this.props.doAction('TASKS_LOAD', {filter});
	}

	handleSelectStatusTab = (status) => {
		this.props.doAction('TASKS_LOAD', {status});	
	}
}

const params = {
  has: 'tasks',
  flat: true
}
export default Store.connect(Tasks, params);