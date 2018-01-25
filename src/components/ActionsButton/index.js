import React from 'react';
import Store from 'xstore';
import Icon from '../../ui/Icon';

export default class ActionsButton extends React.Component {
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
		let {id, loc} = this.props;
		Store.doAction('MODALS_SHOW', {name: 'task_actions', props: {id, loc}});
	}
}