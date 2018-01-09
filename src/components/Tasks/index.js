import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Dialog from '../../ui/Dialog';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Task from '../Task';
import TaskInfo from '../TaskInfo';
import Store from 'xstore';
import {getRoleId} from '../../utils/User';

class Tasks extends React.Component {

	componentDidMount() {
		this.props.doAction('TASKS_LOAD');
	}

	render() {
		let {
				fetching,
				filter,
				status,
				shownTaskData,
				shownTaskIndex,
				prevNextButtons
			} = this.props;
	 	return (
	 		<div class="self">
		 		{getRoleId() != 7 && (
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
					{this.statusTabs}
				</Tabs>
		 		<Loader fetching={fetching} classes="content">
					{this.tasks}
				</Loader>
				{shownTaskData && (
					<Dialog
						title={dict.task_inf}
						classes="~large ~no-overflow"
						onClose={this.handleInfoClose}
						clickMaskToClose>
						<TaskInfo 
							data={shownTaskData}
							index={shownTaskIndex}
							buttons={prevNextButtons}
							onPrev={this.handlePrevTask}
							onNext={this.handleNextTask}/>
					</Dialog>
				)}
			</div>
		)
	}

	get statusTabs() {
		let roleId = getRoleId();
		let tabs = [
			<Tab caption={dict.all} value="all" key="all"/>
		];
		let current = (
				<Tab caption={dict.status_none} value="none" key="none"/>
			),
			ready = (
				<Tab caption={dict.status_ready} value="ready" key="ready"/>
			),
			in_work = (
				<Tab caption={dict.status_in_work} value="in_work" key="in_work"/>
			);

		if (roleId < 5) {
			tabs.push(ready, in_work, current);
		} else {
			tabs.push(current, in_work, ready);
				
		}
		tabs.push(
			<Tab caption={dict.status_cant_do} value="cant_do" key="cant_do"/>
		);
		return tabs;
	}

	get firstTab() {
		let role = getRoleId();
		let caption = role > 4  ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role > 4 ? 'forme' : 'fromme';
		return (
			<Tab caption={caption} value={value}/>
		)
	}

	get secondTab() {
		let role = getRoleId();
		if (role > 5) return;
		let caption = role < 5  ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role < 5 ? 'forme' : 'fromme';
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
					<Task 
						data={task}
						key={i}
						index={i}
						onClick={this.onTaskClick}/>
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

	onTaskClick = (data, index) => {
		this.props.doAction('TASKS_SHOW', {data, index});
	}

	handleInfoClose = () => {
		this.props.doAction('TASKS_HIDE');
	}

	handlePrevTask = () => {
		this.props.doAction('TASKS_SHOW_PREV');	
	}

	handleNextTask = () => {
		this.props.doAction('TASKS_SHOW_NEXT');	
	}
}

const params = {
  has: 'tasks',
  flat: true
}
export default Store.connect(Tasks, params);