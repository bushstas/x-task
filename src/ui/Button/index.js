import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Button({classes, children, href, ...others}) {
	let props = {
		className: classnames('x-task-button', classes),
		...others
	};
	if (href) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		)
	}
	return (
		<div {...props}>
			{children}
		</div>
	)
}