import React from 'react';

import './index.scss';

export default function Button({classes, children, href, width, ...others}) {
	classes = 'self $classes';
	let props = {
		className: classes,
		...others
	};
	if (width) {
		props.style = {
			minWidth: width + 'px'
		}
	}
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