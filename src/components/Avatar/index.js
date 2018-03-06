import React from 'react';
import Store from 'xstore';
import {AVATAR_PATH} from '../../consts/avatar';
import Icon from '../../ui/Icon';

export default class Avatar extends React.Component {
	constructor(props) {
		super();
		this.style = {
			backgroundImage: props.id ? 'url(' + AVATAR_PATH + props.id + '.png)' : null
		}
	}

	render() {
		let {classes, userId, userName, id} = this.props;
		return (
			<div class="self $classes" title={userName}>
				<div class="inner" style={this.style} onClick={this.handleClick}>
					{!id && this.icon}
				</div>
			</div>
		)
	}

	get icon() {
		return <Icon icon="person"/>
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {onClick, userId, userName, id} = this.props;
		if (onClick instanceof Function) {
			onClick({userId, userName, id});
		} else if (id) {
			Store.doAction('MODALS_SHOW', {name: 'user_info', props: {id: userId, name: userName}});
		}
	}
}