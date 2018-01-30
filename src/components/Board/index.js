import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Loader from '../../ui/Loader';
import BoardTask from '../BoardTask';
import Avatar from '../../components/Avatar';
import {addHandler, removeHandler} from '../../utils/EscapeHandler';
import {getProjectName, getProjectColor} from '../../utils/User';

class Board extends React.Component {

	componentDidMount() {
		this.props.doAction('BOARD_LOAD');
		addHandler(this.handleClose);
	}

	componentWillUnmount() {
		removeHandler(this.handleClose);
	}

	render() {
		let {
			tasks,
			fetching,
			filter,
			users,
			addedUsers
		} = this.props;

		return (
			<div class="self">
				<div class="header">
					<Icon icon="close" 
						onClick={this.handleClose}
						classes="close"/>

					<div class="title">
						<span class="logo">
							<Icon size="22" icon="logo"/>
							{dict.logo}
						</span>
						{dict.board}
						<div class="project" style={{backgroundColor: '#' + getProjectColor()}}>
							{getProjectName()}
						</div>
					</div>
					<div class="right-menu" onClick={this.handleRightMenuClick}>
						<span class="$filter=='status'?active" data-value="status">
							{dict.by_status}
						</span>
						<span class="$filter=='type'?active" data-value="type">
							{dict.by_type}
						</span>
						<span class="$filter=='importance'?active" data-value="importance">
							{dict.by_importance}
						</span>
						<span class="$filter=='author'?active" data-value="author">
							{dict.by_author}
						</span>
						<span class="$filter=='exec'?active" data-value="exec">
							{dict.by_exec}
						</span>
					</div>
				</div>
				<Loader classes="outer-content" fetching={fetching}>
					<div class="content">
						{!fetching && this.content}
					</div>
				</Loader>
				<div class="footer">
					<div class="added-users">
						{Object.keys(addedUsers).map(userId => {
							return (
								<Avatar
									key={userId}
									userId={userId}
									userName={addedUsers[userId].userName}
									id={addedUsers[userId].avatarId}
									onClick={this.handleRemoveUserClick}
								/>
							)
						})}
					</div>
					{users && (
						<div class="users">
							{users.map(user => {
								if (!addedUsers[user.userId]) {
									return (
										<Avatar
											key={user.userId}
											userId={user.userId}
											userName={user.userName}
											id={user.avatarId}
											onClick={this.handleAddUserClick}
										/>
									)
								}
							})}
						</div>
					)}
				</div>
			</div>
		)
	}

	get content() {
		let {order, tasks} = this.props;
		if (Object.keys(tasks).length == 0) {
			return this.empty;
		}
		return order.map(this.renderTasks);
	}

	renderTasks = (key) => {
		let {tasks, dict} = this.props;
		tasks = tasks[key];
		if (!tasks || !tasks.length) {
			return;
		}
		return (
			<div class="column" key={key}>
				<div class="tasks">
					<div class="column-title" style={{backgroundColor: '#' + getProjectColor()}}>
						<div class="column-title-inner">
							{dict[key]}
						</div>
					</div>
					<div class="column-content">
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
			</div>
		)
	}

	get empty() {
		return (
			<div class="empty">
				111111
			</div>
		)
	}

	handleTaskClick = (id, index, status) => {
		this.props.doAction('BOARD_SHOW_TASK_INFO', {id, index, status});
	}

	handleRightMenuClick = ({target: {dataset: {value: filter}}}) => {
		if (filter) {
			this.props.doAction('BOARD_LOAD', filter);
		} 
	}

	handleClose = () => {
		this.props.doAction('APP_HIDE');
	}

	handleKeyDown = ({keyCode}) => {
		if (keyCode == 27) {
			this.handleClose();
		}
	}

	handleAddUserClick = (data) => {
		this.props.doAction('BOARD_ADD_USER', data);
	}

	handleRemoveUserClick = ({userId}) => {
		this.props.doAction('BOARD_REMOVE_USER', userId);
	}
}

let params = {
	has: 'board',
	flat: true
}
export default Store.connect(Board, params);