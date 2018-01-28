import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import ActionsButton from '../ActionsButton';

export default class Task extends React.Component {
	static defaultProps = {
		onClick: () => {}
	}

	render() {
		let {data: {
				status,
				type,
				action,
				importance,
				avatar_id,
				user_id,
				user_name,
				locked,
				title,
				changed,
				timeleft,
				overdue,
				actions,
				id
			}
		} = this.props;
		let className = $classy(status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);
		return (
			<div class="self $className" onClick={this.handleClick}>
				<div class="icons">
					<Icon>
						{icons.task_type[type]}
					</Icon>
					<Icon>
						{icons.task_act[action]}
					</Icon>
					<Icon>
						{icons.task_imp[importance]}
					</Icon>
				</div>
				
				<Avatar 
					id={avatar_id}
					userId={user_id}
					userName={user_name}/>
				
				<div class="title">
					{locked && (
						<Icon icon="locked"/>
					)}
					{title}
				</div>
				<div class="status">
					{changed}
					{timeleft && (
						<div class="timeleft $?overdue">
							{timeleft}
						</div>
					)}
				</div>
				{actions && (
					<ActionsButton id={id} loc="tasks"/>
				)}
			</div>
		)
	}

	handleClick = () => {
		this.props.onClick(this.props.data.id, this.props.index);
	}
}