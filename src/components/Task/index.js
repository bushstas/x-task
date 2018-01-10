import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import TaskActionsButton from '../TaskActionsButton';

export default class Task extends React.Component {
	static defaultProps = {
		onClick: () => {},
		onActionsClick: () => {}
	}

	render() {
		let {data, onClick, status} = this.props;
		let {data: d} = data;
		let className;
		if (!status || status == 'all') {
			className = $classy(data.status, '.status-', ['ready', 'in_work', 'delayed']);	
		}		
		return (
			<div class="self $className" onClick={this.handleClick}>
				<div class="icons">
					<Icon>
						{icons.task_type[data.type]}
					</Icon>
					<Icon>
						{icons.task_act[data.action]}
					</Icon>
					<Icon>
						{icons.task_imp[data.importance]}
					</Icon>
				</div>
				
				<Avatar 
					id={data.avatar_id}
					userName={data.user_name}/>
				
				<div class="title">
					{d.title}
				</div>
				<div class="status">
					{data.changed}
				</div>
				{data.actions && (
					<TaskActionsButton onClick={this.handleActionsClick}/>
				)}				
			</div>
		)
	}

	handleClick = () => {
		this.props.onClick(this.props.data, this.props.index);
	}

	handleActionsClick = () => {
		this.props.onActionsClick(this.props.data.id);
	}
}