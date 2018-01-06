import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';

export default function Task({data}) {
	let {data: d} = data;
	let className = $classy(data.status, '.status-', ['ready', 'in_work', 'cant_do']);
	return (
		<div class="self $className">
			<div class="icons">
				<Icon>
					{icons.task_type[data.type]}
				</Icon>
				<Icon>
					{icons.task_act[data.action]}
				</Icon>
				<Icon>
					{icons.task_imp[data.importance]}
				</Icon>
			</div>
			<div class="title">
				{d.title}
			</div>
		</div>
	)
}