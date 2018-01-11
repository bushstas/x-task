import React from 'react';
import Avatar from '../Avatar';
import Dialog from '../../ui/Dialog';

export default class UserInfo extends React.Component {

	render() {
		let {name, onClose} = this.props;
		return (
			<Dialog
				title={name}
				classes="~large self"
				onClose={onClose}
				clickMaskToClose>
				111111111111
			</Dialog>
		)
	}
}