import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Input from '../../ui/Input';

class WorkStatuses extends React.Component {

	componentDidMount() {
		this.props.doAction('STATUSES_LOAD');
	}

	render() {
		let {statuses} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
				<Loader classes="content">
					{statuses && this.content}
				</Loader>
			</div>
		)
	}

	get content() {
		let {dict, reasonShown, reason} = this.props;
		return (
			<div class="inner-content">
					{this.buttons}
					{reasonShown && (
						<div class="reason">
							<div class="reason-title">
								{dict.reason}
							</div>
							<Input 
								name="reason"
								value={reason}
								onChange={this.handleChangeReason}
								textarea/>
							<div class="reason-note">
								* {dict.click}
							</div>
						</div>
					)}
			</div>
		)
	}

	get buttons() {
		let {statuses} = this.props;
		return (
			<div class="actions">
				{statuses.map((status) => {
					let {name, id, current} = status;
					return (
						<Button 
							key={id}
							value={id}
							onClick={this.handleStatusesSelect}
							disabled={current}>
							{name}
						</Button>
					)
				})}
			</div>
		)
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'work_statuses');
	}

  	handleChangeReason = (name, reason) => {
  		this.props.doAction('STATUSES_CHANGE', {reason});
  	}

  	handleStatusesSelect = (status) => {
		let {reasonShown, reason} = this.props;
		if (!reasonShown && status == 2) {
			this.props.doAction('STATUSES_CHANGE', {reasonShown: true});
		} else {
			this.props.doAction('STATUSES_SAVE', {status, reason});	
			this.handleClose();
		}  		
  	}
}

export default Store.connect(WorkStatuses, 'statuses');