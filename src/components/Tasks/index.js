import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Dialog from '../../ui/Dialog';
import Loader from '../../ui/Loader';
import Icon from '../../ui/Icon';
import Button from '../../ui/Button';
import Task from '../Task';
import TaskButton from '../TaskButton';
import Store from 'xstore';
import {getRoleId} from '../../utils/User';

class Tasks extends React.Component {

	componentDidMount() {
		this.props.doAction('TASKS_START_UPDATE');
	}

	componentWillUnmount() {
		this.props.doAction('TASKS_STOP_UPDATE');		
	}

	render() {
		let {
			tasksFetching
		} = this.props;
	 	return (
	 		<div class="self">
		 		{this.tabs}
		 		<Loader fetching={tasksFetching} classes="content">
					{this.tasks}
				</Loader>
				{this.leftMenu}
				{this.rightMenu}
			</div>
		)
	}

	get tabs() {
		let {
			filter,
			status = []
		} = this.props;
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
						{this.fourthTab}
					</Tabs>
				)}
				
				<Tabs 
					classes="statuses"
					onSelect={this.handleSelectStatusTab}
					value={status}
					simple
					multiple>
					{this.statusTabs}
				</Tabs>
				
			</div>
		)
	}

	get leftMenu() {
		let {task_imp} = icons;
		let {importance = []} = this.props;
		return (
			<div class="left-menu">
				{Object.keys(task_imp).map(
					(key) => {
						let value = task_imp[key];
						return (
							<TaskButton
								classes="~left"
								active={importance.indexOf(key) > -1}
								icon={value}
								title={dict[key]}
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
		let {task_type} = icons;
		let {type = []} = this.props;
		return (
			<div class="right-menu">
				{Object.keys(task_type).map(
					(key) => {
						let value = task_type[key];
						return (
							<TaskButton 
								classes="~right"
								active={type.indexOf(key) > -1}
								icon={value}
								title={dict[key]}
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
		let tabs = [];
		let current = (
				<Tab caption={dict.status_current} value="current" key="current"/>
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
			<Tab caption={dict.status_closed} value="closed" key="closed" single/>
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

	get fourthTab() {
		let role = getRoleId();
		if (role == 1) return;
		return this.renderTab(dict.mine_tasks, 'my');
	}

	renderTab(caption, value) {
		let {counts = {}} = this.props;
		let count = counts[value];
		caption = (
			<span>
				{caption} &nbsp;{count}
				<span class=".tabs-count">
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
		let {tasks, status, filter} = this.props;
		if (tasks instanceof Array) {
			if (tasks.length > 0) {
				return tasks.map((task, i) => {
					return (
						<Task 
							filter={filter}
							status={status}
							data={task}
							key={i}
							index={i}
							onClick={this.handleTaskClick}/>
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
		this.props.doAction('TASKS_START_UPDATE', {filter});
	}

	handleSelectStatusTab = (status) => {
		this.props.doAction('TASKS_START_UPDATE', {status});
	}

	handleTaskClick = (id, index) => {
		this.props.doAction('TASKS_SHOW_TASK_INFO', {id, index});
	}

	handleInfoClose = () => {
		this.props.doAction('TASKS_HIDE');
	}

	handleTypeSelect = (type) => {
		this.props.doAction('TASKS_START_UPDATE', {type});
	}

	handleImportanceSelect = (importance) => {
		this.props.doAction('TASKS_START_UPDATE', {importance});
	}
}

const params = {
  has: 'tasks',
  flat: true
}
export default Store.connect(Tasks, params);