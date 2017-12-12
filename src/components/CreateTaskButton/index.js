import React from 'react';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import {cn} from '../../utils/Cn';

import './index.scss';

export default function CreateTaskButton({onClick}) {
	return (
		<div 
			className={cn(2)}
			onClick={onClick}
			title={dict.create_task}>
			<Icon icon="addtask"/>
		</div>
	)
}