import React from 'react';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Loader from '../../ui/Loader';
import BoardTask from '../BoardTask';

export default class Board extends React.Component {

	render() {
		let {title = 'Board', tasks} = this.props;
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
				<Loader classes="content" fetching={!tasks}>
					<div class="column column1">
						{this.renderTasks('current')}
					</div>
					<div class="column column2">
						{this.renderTasks('in_work')}
					</div>
					<div class="column column3">
						{this.renderTasks('delayed')}
					</div>
					<div class="column column4">
						{this.renderTasks('ready')}
					</div>
					<div class="column column5">
						{this.renderTasks('frozen')}
					</div>
				</Loader>
			</div>
		)
	}

	renderTasks(key) {
		let {tasks} = this.props;
		tasks = tasks[key];
		return (
			<div class="tasks">
				<div class="column-title">
					{dict['status_' + key]}
				</div>
				{tasks.map((task) => {
					return (
						<BoardTask key={task.id} data={task}/>
					)
				})}
			</div>
		)
	}

	get empty() {
		return (
			<div class="empty">

			</div>
		)
	}
}