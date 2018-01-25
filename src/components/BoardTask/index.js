import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import ActionsButton from '../ActionsButton';

export default class BoardTask extends React.Component {
	render() {
		let {data: {
			id,
			title,
			avatar_id,
			user_id,
			user_name
		}} = this.props;
		return (
			<div class="self">
				<div class="top">
					<Avatar
						id={avatar_id}
						userId={user_id}
						userName={user_name}/>
				</div>
				<div class="title">
					{title}
				</div>
				<ActionsButton id={id} loc="board"/>
			</div>
		)
	}
}