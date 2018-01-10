import React from 'react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';

export default class TaskActions extends React.Component {
	static defaultProps = {
		onClose: () => {}
	}

	render() {
		let {data: {dict}} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClickMask}/>
				<Loader classes="content" fetching={!dict}>
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
					return (
						<Button key={action} value={action} onClick={onAction}>
							{dict[action]}
						</Button>
					)
				})}
			</div>
		)
	}

	handleClickMask = () => {
		this.props.onClose();
	}
}