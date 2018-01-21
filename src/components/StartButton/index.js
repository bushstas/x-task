import React from 'react';
import Store from 'xstore';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import {hasRight, isAuthorized} from '../../utils/User';

class StartButton extends React.Component {
	render() {
		return (
			<div class="self">
				<div class="main" onClick={this.handleStartClick}>
					<Icon icon="logo"/>
				</div>
				{isAuthorized() && (
					<span class="menu">
						<div 
							class="user"
							title={dict.status}
							onClick={null}>
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
					</span>
				)}
			</div>
		)
	}

	handleStartClick = () => {
		let {active} = this.props;
    	this.props.doAction('APP_CHANGE', {active: !active});
  	}

	get hasCreateButton() {
		return !this.props.quicktaskMode && hasRight('add_dev_task');
	}

	handleAddTaskClick = () => {
		this.props.doAction('APP_CHANGE', {quicktaskMode: true});
  	}
}

const params = {
  has: 'app',
  flat: true
}
export default Store.connect(StartButton, params);