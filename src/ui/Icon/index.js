import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Icon({children, classes, size, ...others}) {
	let style;
	if (size) {
		style = {
			fontSize: size + 'px'
		}
	}
	return (
		<i 
			className={classnames('x-task-icon', classes)}
			style={style}
			{...others}>
			{children}
		</i>
	)
}