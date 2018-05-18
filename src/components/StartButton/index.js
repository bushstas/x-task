import React from 'react';
import Store from 'xstore';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';

class StartButton extends React.Component {
	render() {
		let {shown, isAuthorized} = this.props;
		let active = shown == 'main';
		return (
			<div class="self $?active">
				<div class="main" onClick={this.handleStartClick}>
					<Icon icon="logo"/>
				</div>
				{isAuthorized && (
					<div class="menu">
						{shown != 'board' && (
							<div title={dict.board} onClick={this.handleBoardClick}>
								<Icon icon="board"/>
							</div>
						)}
						<div title={dict.quickcall} onClick={this.handleNumberClick}>
							#
						</div>
						<div title={dict.work_status} onClick={this.handleStatusClick}>
							<Icon icon="user"/>
						</div>
						{this.hasCreateButton && (
							<div title={dict.create_task} onClick={this.handleAddTaskClick}>
								<Icon icon="addtask"/>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}

	handleStartClick = () => {
		let {shown} = this.props;
		shown = shown != 'main' ? 'main' : null;
    	this.props.doAction('APP_SHOW', shown);
  	}

  	handleStatusClick = () => {
  		this.props.doAction('MODALS_SHOW', {name: 'work_statuses'});
  	}

	get hasCreateButton() {
		const {quicktaskMode, canCreateTask} = this.props;
		return !quicktaskMode && canCreateTask;
	}

	handleAddTaskClick = () => {
		this.props.doAction('APP_SHOW', 'quicktask');
  	}

  	handleBoardClick = () => {
  		this.props.doAction('APP_SHOW', 'board');
  	}

  	handleNumberClick = () => {
  		this.props.doAction('MODALS_SHOW', {name: 'quick_call'});
  	}
}

export default Store.connect(StartButton, 'app, user:isAuthorized|canCreateTask');