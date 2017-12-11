import React from 'react';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';

import './index.scss';

export default function CreateTaskButton({onClick}) {
	return (
		<div 
			className="x-task-create-task-button"
			onClick={onClick}
			title={dict.create_task}>
			<Icon icon="addtask"/>
		</div>
	)
}