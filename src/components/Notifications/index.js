import React from 'react';
import Store from 'xstore';
import Notification from '../../ui/Notification';

import './index.scss';

class Notifications extends React.Component {
	render() {
		return (
			<div className="x-task-notifications">
				{this.messages}
			</div>
		)	
	}

	get messages() {
		let {items} = this.props;
		if (items instanceof Array) {
			return items.map((item, i) => {
				return (
					<Notification key={i} classes={item.classes}>
						{item.message}
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