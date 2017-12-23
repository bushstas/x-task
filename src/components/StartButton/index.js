import React from 'react';
import Icon from '../../ui/Icon';
import MaskModeButton from '../../components/MaskModeButton';
import {dict} from '../../utils/Dictionary';

export default function StartButton({onClick, onCreateTask, createTaskShown, maskButtonShown}) {
	return (
		<div class="self">
			<div class="main" onClick={onClick}>
				<Icon icon="logo"/>
			</div>
			<span class="menu">
				{maskButtonShown && (
					<MaskModeButton/>
				)}
				{createTaskShown && (
					<div 
						class="create"
						title={dict.create_task}
						onClick={onCreateTask}>
						<Icon icon="addtask"/>
					</div>
				)}
			</span>
		</div>
	)
}