import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Loader from '../../ui/Loader';
import BoardTask from '../BoardTask';

class Board extends React.Component {

	componentDidMount() {
		this.props.doAction('BOARD_LOAD');
	}

	render() {
		let {title = 'Board', tasks, fetching} = this.props;
		return (
			<div class="self">
				<div class="header">
					<div class="title">
						<span class="logo">
							<Icon size="22" icon="logo"/>
							{dict.logo}
						</span>
						{title}
					</div>
				</div>
				<Loader classes="content" fetching={fetching}>
					{!fetching && this.content}
				</Loader>
			</div>
		)
	}

	get content() {
		this.left = 0;
		return [
			this.renderTasks('current'),
			this.renderTasks('in_work'),
			this.renderTasks('delayed'),
			this.renderTasks('ready'),
			this.renderTasks('frozen')
		];
	}

	renderTasks(key) {
		let {tasks} = this.props;
		tasks = tasks[key];
		if (!tasks.length) {
			return;
		}
		let left = this.left;
		this.left += 20;
		return (
			<div class="column" key={key} style={{left: left + '%'}}>
				<div class="tasks">
					<div class="column-title">
						{dict['status_' + key]}
					</div>
					{tasks.map((task, idx) => {
						return (
							<BoardTask 
								key={task.id}
								data={task}
								index={idx}
								status={key}
								onClick={this.handleTaskClick}/>
						)
					})}
				</div>
			</div>
		)
	}

	get empty() {
		return (
			<div class="empty">

			</div>
		)
	}

	handleTaskClick = (id, index, status) => {
		this.props.doAction('BOARD_SHOW_TASK_INFO', {id, index, status});
	}
}

let params = {
	has: 'board',
	flat: true
}
export default Store.connect(Board, params);