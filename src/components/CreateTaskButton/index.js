import React from 'react';
import Icon from '../../ui/Icon';

import './index.scss';

export default function CreateTaskButton({onClick}) {
	return (
		<div className="x-task-create-task-button" onClick={onClick}>
			<Icon>
				add_circle_outline
			</Icon>
		</div>
	)
}