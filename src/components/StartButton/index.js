import React from 'react';
import Store from 'xstore';
import WorkStatuses from '../WorkStatuses';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import {hasRight, isAuthorized} from '../../utils/User';

class StartButton extends React.Component {
	render() {
		let {active, statusesDict} = this.props;
		return (
			<div class="self $?active">
				<div class="main" onClick={this.handleStartClick}>
					<Icon icon="logo"/>
				</div>
				{isAuthorized() && (
					<div class="menu">
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
				{statusesDict && (
					<WorkStatuses 
						dict={statusesDict}
						onClose={this.handleStatusesClose}
						onSelect={this.handleStatusesSelect}/>
				)}
			</div>
		)
	}

	handleStartClick = () => {
		let {active} = this.props;
    	this.props.doAction('APP_CHANGE', {active: !active});
  	}

  	handleStatusClick = () => {
  		this.props.doAction('APP_SHOW_STATUS');
  	}

	get hasCreateButton() {
		return !this.props.quicktaskMode && hasRight('add_dev_task');
	}

	handleAddTaskClick = () => {
		this.props.doAction('APP_CHANGE', {quicktaskMode: true});
  	}

  	handleStatusesClose = () => {
  		this.props.doAction('APP_CHANGE', {statusesDict: null});
  	}

  	handleStatusesSelect = (status) => {
  		this.props.doAction('APP_SAVE_STATUS', {status});	
  	}
}

const params = {
  has: 'app',
  flat: true
}
export default Store.connect(StartButton, params);