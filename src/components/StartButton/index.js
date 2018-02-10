import React from 'react';
import Store from 'xstore';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import {hasRight, isAuthorized} from '../../utils/User';

class StartButton extends React.Component {
	render() {
		let {shown} = this.props;
		let active = shown == 'main';
		return (
			<div class="self $?active">
				<div class="main" onClick={this.handleStartClick}>
					<Icon icon="logo"/>
				</div>
				{isAuthorized() && (
					<div class="menu">
						{shown != 'board' && (
							<div 
								class="board"
								title={dict.board}
								onClick={this.handleBoardClick}>
								<Icon icon="board"/>
							</div>
						)}
						<div 
							class="user"
							title={dict.work_status}
							onClick={this.handleStatusClick}>
							<Icon icon="user"/>
						</div>
						{this.hasCreateButton && (
							<div 
								class="create"
								title={dict.create_task}
								onClick={this.handleAddTaskClick}>
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
    	this.props.doAction('APP_CHANGE', {shown});
  	}

  	handleStatusClick = () => {
  		this.props.doAction('MODALS_SHOW', {name: 'work_statuses'});
  	}

	get hasCreateButton() {
		return !this.props.quicktaskMode && hasRight('add_dev_task');
	}

	handleAddTaskClick = () => {
		this.props.doAction('APP_CHANGE', {shown: 'quicktask'});
  	}

  	handleBoardClick = () => {
  		this.props.doAction('APP_SHOW_BOARD');
  	}
}

export default Store.connect(StartButton, 'app');