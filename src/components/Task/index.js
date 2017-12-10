import React from 'react';

import './index.scss';

export default function Task({data}) {
	return (
		<div className="x-task-task">
			{data.title}
		</div>
	)
}