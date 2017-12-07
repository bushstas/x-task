import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Icon({children, classes, ...others}) {
	return (
		<i className={classnames('x-task-icon', classes)} {...others}>
			{children}
		</i>
	)
}