import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Notification({children, classes}) {
	return (
		<div className={classnames('x-task-notification', classes)}>
			{children}
		</div>
	)
}