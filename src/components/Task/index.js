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
				id,
				idn
			},
			classes
		} = this.props;
		let className = $classy(status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);
		let className2;
		if (!avatar_id) {
			className2 =  $classy('without-avatar');
		}
		return (
			<div class="self $classes $className $className2" onClick={this.handleClick}>
				<div class="id">
					<span class=".gray">#</span>{idn}
				</div>

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
				
				{avatar_id && 
					<Avatar 
						id={avatar_id}
						userId={user_id}
						userName={user_name}/>
				}
				
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
					<ActionsButton 
						id={id} 
						loc="tasks"
						name="task_actions"/>
				)}
				{this.props.children}
			</div>
		)
	}

	handleClick = () => {
		this.props.onClick(this.props.data.id, this.props.index);
	}
}