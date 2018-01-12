import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Dialog from '../../ui/Dialog';
import Loader from '../../ui/Loader';
import Icon from '../../ui/Icon';
import Button from '../../ui/Button';
import Task from '../Task';
import TaskInfo from '../TaskInfo';
import TaskButton from '../TaskButton';
import TaskActions from '../TaskActions';
import Store from 'xstore';
import {getRoleId, getTasksCount} from '../../utils/User';

class Tasks extends React.Component {

	componentDidMount() {
		if (this.props.my) {
			this.props.doAction('TASKS_LOAD', {filter: 'my'});	
		} else {
			this.props.doAction('TASKS_LOAD');
		}		
	}

	render() {
		let {
			my,
			fetching,
			shownTaskData,
			shownTaskIndex,
			prevNextButtons,
			taskActionsData
		} = this.props;

	 	return (
	 		<div class="self">
		 		{this.tabs}
		 		<Loader fetching={fetching} classes="content $?my">
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
							onNext={this.handleNextTask}
							onActionsClick={this.handleTaskActionsClick}/>
					</Dialog>
				)}
				{taskActionsData && (
					<TaskActions 
						data={taskActionsData}
						onClose={this.handleActionsClose}
						onAction={this.handleTaskAction}/>
				)}
				{this.leftMenu}
				{this.rightMenu}
			</div>
		)
	}

	get tabs() {
		let {
			filter,
			status,
			my
		} = this.props;
		if (my) {
			return;
		}
		return (
			<div>
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
			</div>
		)
	}

	get leftMenu() {
		if (this.props.my) {
			return;
		}
		let {task_imp} = icons;
		let {importance} = this.props;
		return (
			<div class="left-menu">
				{Object.keys(task_imp).map(
					(key) => {
						let value = task_imp[key];
						return (
							<TaskButton
								classes="~left"
								active={importance == key}
								icon={value}
								value={key}
								key={key}
								onSelect={this.handleImportanceSelect}/>
						)
					}
				)}
			</div>
		)
	}

	get rightMenu() {
		if (this.props.my) {
			return;
		}
		let {task_type} = icons;
		let {type} = this.props;
		return (
			<div class="right-menu">
				{Object.keys(task_type).map(
					(key) => {
						let value = task_type[key];
						return (
							<TaskButton 
								classes="~right"
								active={type == key}
								icon={value}
								value={key}
								key={key}
								onSelect={this.handleTypeSelect}/>
						)
					}
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
			<Tab caption={dict.status_delayed} value="delayed" key="delayed"/>,
			<Tab caption={dict.status_frozen} value="frozen" key="frozen"/>,
			<Tab caption={dict.status_closed} value="closed" key="closed"/>
		);
		return tabs;
	}

	get secondTab() {
		let role = getRoleId();
		let caption = role > 4  ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role > 4 ? 'forme' : 'fromme';
		return this.renderTab(caption, value);
		
	}

	get thirdTab() {
		let role = getRoleId();
		if (role > 5 || role == 1) return;
		let caption = role < 5  ? dict.tasks_for_me : dict.tasks_from_me;
		let value = role < 5 ? 'forme' : 'fromme';
		return this.renderTab(caption, value);
	}

	renderTab(caption, value) {
		let counts = getTasksCount();
		let count = counts[value];
		caption = (
			<span>
				{caption} &nbsp;{count}
				<span class="count">
					{count}
				</span>
			</span>
		)
		return (
			<Tab caption={caption} value={value} disabled={count == 0}/>
		)
	}

	get firstTab() {
		return this.renderTab(dict.all_tasks, 'all');
	}

	get tasks() {
		let {tasks, status} = this.props;
		if (tasks instanceof Array) {
			if (tasks.length > 0) {
				return tasks.map((task, i) => {
					return (
						<Task 
							status={status}
							data={task}
							key={i}
							index={i}
							onClick={this.handleTaskClick}
							onActionsClick={this.handleTaskActionsClick}/>
					)
				});
			}
			return this.noTasks;
		}
	}

	get noTasks() {
		return (
			<div class="no-tasks">
				<Icon icon="sad"/>
				<div class="no-tasks-text">
					{dict.no_tasks}
				</div>
			</div>
		)
	}

	handleSelectTab = (filter) => {
		this.props.doAction('TASKS_LOAD', {filter});
	}

	handleSelectStatusTab = (status) => {
		this.props.doAction('TASKS_LOAD', {status});
	}

	handleTaskClick = (data, index) => {
		this.props.doAction('TASKS_SHOW', {data, index});
	}

	handleTaskActionsClick = (id) => {
		this.props.doAction('TASKS_SHOW_ACTIONS', id);
	}

	handleActionsClose = () => {
		this.props.dispatch('TASKS_CHANGED', {taskActionsData: null});	
	}

	handleTaskAction = (action) => {
		this.props.doAction('TASKS_ACTION', action);
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

	handleTypeSelect = (type) => {
		this.props.doAction('TASKS_LOAD', {type});
	}

	handleImportanceSelect = (importance) => {
		this.props.doAction('TASKS_LOAD', {importance});
	}
}

const params = {
  has: 'tasks',
  flat: true
}
export default Store.connect(Tasks, params);