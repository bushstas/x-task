import React from 'react';

export default function Notification({children, classes}) {
	return (
		<div class="self $classes">
			{children}
		</div>
	)
}