import React from 'react';
import Icon from '../Icon';
import Dialog from '../Dialog';
import Store from 'xstore';
import {dict, icons} from '../../utils/Dictionary';

class Tooltip extends React.PureComponent {
	render() {
		let {tooltip} = this.props;
		return (
			<span class="self">
				<Icon onClick={this.handleClick}>
					{icons.tooltip}
				</Icon>
				{!!tooltip && (
					<Dialog
						title={dict.tooltip}
						classes="~small"
						clickMaskToClose={true}
						onClose={this.handleClose}>
						{tooltip}
					</Dialog>
				)}
			</span>
		)
	}

	handleClick = () => {
		let {children: name} = this.props;
		if (name) {
			this.props.doAction('TOOLTIP_SHOW', name);
		}
	}

	handleClose = () => {
		this.props.dispatch('TOOLTIP_CLOSED');
	}
}

let params = {
	has: 'tooltip',
	flat: true
}
export default Store.connect(Tooltip, params);