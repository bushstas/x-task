import React from 'react';
import {AVATAR_PATH} from '../../consts/avatar';
import Store from 'xstore';

export default class Avatar extends React.Component {
	constructor(props) {
		super();
		this.style = {
			backgroundImage: 'url(' + AVATAR_PATH + props.id + '.png)'
		}
	}

	render() {
		let {classes, userId, userName} = this.props;
		return (
			<div class="self $classes" title={userName}>
				<div class="inner" style={this.style} onClick={this.handleClick}/>
			</div>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		const {onClick, userId, userName, id} = this.props;
		if (onClick instanceof Function) {
			onClick({userId, userName, id});
		} else {
			Store.doAction('MODALS_SHOW', {name: 'user_info', props: {id: userId, name: userName}});
		}
	}
}