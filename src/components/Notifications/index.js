import React from 'react';
import Store from 'xstore';
import Notification from '../../ui/Notification';
import SpecialNotification from '../../ui/SpecialNotification';
import {dict} from '../../utils/Dictionary';

class Notifications extends React.Component {
	render() {
		return (
			<div class=".notifications">
				{this.special}
				{this.messages}
			</div>
		)	
	}

	get special() {
		let {special} = this.props;
		if (special) {
			let {message, messageFromDict} = special;
			if (messageFromDict && dict[messageFromDict]) {
				message = dict[messageFromDict];
			}
			return (
				<SpecialNotification>
					{message}
				</SpecialNotification>
			)
		}
	}

	get messages() {
		let {items} = this.props;
		if (items instanceof Array) {
			return items.map((item, i) => {
				let {classes, message, messageFromDict} = item;
				if (messageFromDict && dict[messageFromDict]) {
					message = dict[messageFromDict];
				}
				return (
					<Notification key={i} classes="$classes">
						{message}
					</Notification>
				)
			});
		}
	}
}

let params = {
	has: 'notifications',
	flat: true
}
export default Store.connect(Notifications, params);

export const showSuccessNotification = (message) => {
	const classes = $classy(".notification-success");
	Store.doAction('NOTIFICATIONS_ADD', {message: message, classes, showtime: 4000});
}

export const showErrorNotification = (message) => {
	Store.doAction('NOTIFICATIONS_ADD', {message, showtime: 4000});
}

