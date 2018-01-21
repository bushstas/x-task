import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import ActionsButton from '../ActionsButton';

export default class Task extends React.Component {
	static defaultProps = {
		onClick: () => {},
		onActionsClick: () => {}
	}

	render() {
		let {data, status, filter} = this.props;
		let {data: d} = data;
		let className = $classy(data.status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);
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
					userId={data.user_id}
					userName={data.user_name}/>
				
				<div class="title">
					{data.locked && (
						<Icon icon="locked"/>
					)}
					{d.title}
				</div>
				<div class="status">
					{data.changed}
				</div>
				{data.actions && (
					<ActionsButton onClick={this.handleActionsClick}/>
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