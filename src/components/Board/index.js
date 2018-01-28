import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Loader from '../../ui/Loader';
import BoardTask from '../BoardTask';
import {addHandler, removeHandler} from '../../utils/EscapeHandler';

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
			filter
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
					</div>
				</div>
				<Loader classes="outer-content" fetching={fetching}>
					<div class="content">
						{!fetching && this.content}
					</div>
				</Loader>
				<div class="footer">
				</div>
			</div>
		)
	}

	get content() {
		let {order} = this.props;
		return order.map(this.renderTasks);
	}

	renderTasks = (key) => {
		let {tasks, dict} = this.props;
		tasks = tasks[key];
		if (!tasks.length) {
			return;
		}
		return (
			<div class="column" key={key}>
				<div class="tasks">
					<div class="column-title">
						{dict[key]}
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
}

let params = {
	has: 'board',
	flat: true
}
export default Store.connect(Board, params);