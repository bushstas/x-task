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

		const style = {backgroundColor: '#' + getProjectColor()};

		return (
			<div class="self">
				<div class="header">
					<div class="header-bg" style={style}/>
					<div class="header-inner">
						<Icon icon="close" 
							onClick={this.handleClose}
							classes="close"/>

						<div class="title">
							<span class="logo">
								<Icon size="22" icon="logo"/>
								{dict.logo}
							</span>
							{dict.board}
							<div class="project" style={style}>
								{getProjectName()}
							</div>
						</div>
						<div class="right-menu" onClick={this.handleRightMenuClick}>
							<span class="menu-item $filter=='status'?active" data-value="status">
								<span class="menu-item-bg" style={style}/>
								<span class="menu-item-inner">
									{dict.by_status}
								</span>
							</span>
							<span class="menu-item $filter=='type'?active" data-value="type">
								<span class="menu-item-bg" style={style}/>
								<span class="menu-item-inner">
									{dict.by_type}
								</span>
							</span>
							<span class="menu-item $filter=='importance'?active" data-value="importance">
								<span class="menu-item-bg" style={style}/>
								<span class="menu-item-inner">
									{dict.by_importance}
								</span>
							</span>
							<span class="menu-item $filter=='author'?active" data-value="author">
								<span class="menu-item-bg" style={style}/>
								<span class="menu-item-inner">
									{dict.by_author}
								</span>
							</span>
							<span class="menu-item $filter=='exec'?active" data-value="exec">
								<span class="menu-item-bg" style={style}/>
								<span class="menu-item-inner">
									{dict.by_exec}
								</span>
							</span>
						</div>
					</div>
				</div>
				<Loader classes="outer-content" fetching={fetching}>
					<div class="content">
						{!fetching && this.content}
					</div>
				</Loader>
				<div class="footer">
					<div class="footer-bg" style={style}/>
					<div class="footer-inner">
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