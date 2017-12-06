import React from 'react';

import './index.scss';

export default function StartButton({onClick}) {
	return (
		<div className="x-task-start-button" onClick={onClick}>
			XTask
		</div>
	)
}