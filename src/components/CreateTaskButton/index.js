import React from 'react';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';

export default function CreateTaskButton({onClick}) {
	return (
		<div 
			class="self"
			onClick={onClick}
			title={dict.create_task}>
			<Icon icon="addtask"/>
		</div>
	)
}