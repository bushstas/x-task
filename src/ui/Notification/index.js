import React from 'react';

import './index.scss';

export default function Notification({children, classes}) {
	return (
		<div class="self $classes">
			{children}
		</div>
	)
}