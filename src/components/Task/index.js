import React from 'react';
import {icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';

export default class Task extends React.Component {
	render() {
		let {data, onClick, status} = this.props;
		let {data: d} = data;
		let className;
		if (!status || status == 'all') {
			className = $classy(data.status, '.status-', ['ready', 'in_work', 'delayed']);	
		}		
		return (
			<div class="self $className" onClick={this.handleClick}>
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
				<div class="status">
					{data.changed}
				</div>
			</div>
		)
	}

	handleClick = () => {
		this.props.onClick(this.props.data, this.props.index);
	}
}