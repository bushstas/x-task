import React from 'react';

import './index.scss';

export default function Task({data}) {
	return (
		<div class=".task">
			{data.title}
		</div>
	)
}