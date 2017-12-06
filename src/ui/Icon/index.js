import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Icon({children, onClick, classes}) {
	return (
		<i className={classnames('x-task-icon', classes)}
		   onClick={onClick}>
			{children}
		</i>
	)
}