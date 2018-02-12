import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import ActionsButton from '../ActionsButton';

export default class BoardTask extends React.Component {
	render() {
		let {data: {
			type,
			action,
			importance,
			status,
			id,
			idn,
			title,
			avatar_id,
			user_id,
			user_name,
			changed,
			actions
		}} = this.props;

		let className = $classy(status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);

		return (
			<div class="self $className" onClick={this.handleClick}>
				<div class="top">
					<Avatar
						id={avatar_id}
						userId={user_id}
						userName={user_name}/>

					<div class="icons">
						<span class="id">
							<span class=".gray">#</span>{idn}
						</span>
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
					<div class="changed">
						{changed}
					</div>
				</div>
				<div class="title">
					<div class="title-inner">
						{title}
					</div>
				</div>
				{actions && (
					<ActionsButton id={id} loc="board"/>
				)}
			</div>
		)
	}

	handleClick = () => {
		let {data: {id}, index, status, onClick} = this.props;
		onClick(id, index, status);
	}
}