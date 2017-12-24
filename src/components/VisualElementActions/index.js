import React from 'react';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';

export default class VisualElementActions extends React.PureComponent {
	render() {
		let {active: a} = this.props;
		return (
			<div 
				class="self"
				onMouseDown={this.stopPropagation}
				onWheel={this.stopPropagation}>
				{this.props.actions.map((action) => {
					let active = a == action;
					return (
						<Icon 
							onClick={this.handleClick}
							classes="$?.active"
							data-action={action}
							key={action}
							title={dict[action]}
							icon={action}/>
					)
				})}
			</div>
		)
	}

	handleClick = ({target: {dataset: {action}}}) => {
		if (action) {
			Store.doAction('QUICKTASK_CHANGE_VISUAL_ELEMENT', {action});
		}
	}

	stopPropagation = (e) => {
		e.stopPropagation();
	}
}