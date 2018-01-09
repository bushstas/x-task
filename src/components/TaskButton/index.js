import React from 'react';
import Icon from '../../ui/Icon';

export default class TaskButton extends React.Component {
	render() {
		let {icon, active, classes} = this.props;
		return (
			<div class="self $classes $?active" onClick={this.handleClick}>
				<Icon>
					{icon}
				</Icon>
			</div>
		)
	}

	handleClick = () => {
		let {onSelect, value} = this.props;
		onSelect(value);
	}
}