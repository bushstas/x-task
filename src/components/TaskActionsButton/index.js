import React from 'react';
import Icon from '../../ui/Icon';

export default class TaskActionsButton extends React.Component {
	static defaultProps = {
		onClick: () => {}
	}
	
	render() {
		return (
			<div class="self" onClick={this.handleClick}>
				<Icon icon="settings"/>
			</div>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		this.props.onClick();
	}
}