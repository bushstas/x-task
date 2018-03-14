import React from 'react';
import Avatar from '../Avatar';
import Loader from '../../ui/Loader';

export default class Avatars extends React.Component {

	render() {
		let {avatars} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
				<Loader classes="content" fetching={!avatars}>
					{avatars && this.content}
				</Loader>
			</div>
		)
	}

	get content() {
		const {avatars} = this.props;
		return (
			<div class="content">
				{avatars.map(avatar => {
					return (
						<Avatar 
							id={avatar.avatar_id}
							userName={avatar.name}
							userId={avatar.id}
							onClick={this.handleAvatarClick}/>
					)
				})}
			</div>
		)
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'avatars');
	}

  	handleAvatarClick = ({userId}) => {
  		this.props.doAction('STATUSES_SELECT_USER', userId);	
  	}
}