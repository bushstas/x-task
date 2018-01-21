import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';

export default class BoardTask extends React.Component {
	render() {
		let {data: {
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
			</div>
		)
	}
}