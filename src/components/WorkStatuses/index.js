import React from 'react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Input from '../../ui/Input';

export default class WorkStatuses extends React.Component {
	static defaultProps = {
		onClose: () => {},
		onSelect: () => {}
	}

	constructor() {
		super();
		this.state = {};
	}

	render() {
		let {reasonShown} = this.state;
		let {dict} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClickMask}/>
				<Loader classes="content">
					{this.buttons}
					{reasonShown && (
						<div class="reason">
							<div class="reason-title">
								{dict.reason}
							</div>
							<Input name="reason" textarea/>
							<div class="reason-note">
								* {dict.click}
							</div>
						</div>
					)}
				</Loader>
			</div>
		)
	}

	get buttons() {
		let {dict: {statuses}, onAction} = this.props;
		return (
			<div class="actions">
				{statuses.map((status) => {
					let {name, id, current} = status;
					return (
						<Button 
							key={id}
							value={id}
							onClick={this.handleAction}
							disabled={current}>
							{name}
						</Button>
					)
				})}
			</div>
		)
	}

	handleAction = (status) => {
		let {reasonShown} = this.state;
		if (!reasonShown && status == 2) {
			this.setState({reasonShown: true});
		} else {
			this.props.onSelect(status);
			this.handleClickMask();
		}
	}

	handleClickMask = () => {
		this.props.onClose();
	}
}