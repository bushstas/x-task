import React from 'react';
import Store from 'xstore';
import Avatar from '../Avatar';
import Loader from '../../ui/Loader';

class Avatars extends React.Component {

	componentDidMount() {
		this.props.doAction('AVATARS_LOAD');
	}

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
		return avatars.map(avatar => {
			let className;
			if (!avatar.available) {
				className = $classy('unavailable');
			}
			return (
				<Avatar 
					key={avatar.id}
					classes="$className"
					id={avatar.id}
					onClick={avatar.available ? this.handleAvatarClick : null}/>
			)
		});
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'avatars');
	}

  	handleAvatarClick = ({id}) => {
  		this.props.doAction(this.props.store + '_SET_AVATAR', id);
  	}
}

export default Store.connect(Avatars, 'avatars');