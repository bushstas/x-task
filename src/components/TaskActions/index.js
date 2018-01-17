import React from 'react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Tooltip from '../../ui/Tooltip';

export default class TaskActions extends React.Component {
	static defaultProps = {
		onClose: () => {},
		onAction: () => {}
	}

	render() {
		let {data: {dict}} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClickMask}/>
				<Loader classes="content" fetching={!dict}>
					<div class="tooltip">
						<Tooltip dark>
							task_actions
						</Tooltip>
					</div>
					{this.buttons}
				</Loader>
			</div>
		)
	}

	get buttons() {
		let {data: {actions = [], dict}, onAction} = this.props;
		return (
			<div class="actions">
				{actions.map((action) => {
					let {name, available} = action;
					return (
						<Button 
							key={name}
							value={name}
							onClick={this.handleAction}
							disabled={!available}>
							{dict[name]}
						</Button>
					)
				})}
			</div>
		)
	}

	handleAction = (action) => {
		this.props.onAction(action);
		this.handleClickMask();
	}

	handleClickMask = () => {
		this.props.onClose();
	}
}