import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';

class QuickCall extends React.Component {

	componentDidMount() {
		this.handleClick();
	}

	render() {
		const {value, notFound} = this.props;
		return (
			<div class="self" onClick={this.handleClick}>
				<div class="mask" onClick={this.handleClose}/>
				<div class="content">
					<div class="title">
						{dict.quick_call}
					</div>
					<div class="number">
						<span class=".gray">#</span>{value}
						<input 
							onKeyUp={this.handleKeyUp}
							ref="input"
							type="text"
							maxLength="4"
							value={value}
							onChange={this.handleChange}/>
					</div>
					{notFound && (
						<div class="not-found">
							{dict.no_tasks}
						</div>
					)}
				</div>
			</div>
		)
	}

	handleClick = () => {
		this.refs.input.focus();
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'quick_call');
	}

	handleChange = ({target: {value}}) => {
		value = value.replace(/[^\d]/, '');
		this.props.doAction('QUICKCALL_CHANGE', value);
	}

	handleKeyUp = ({keyCode}) => {
		if (keyCode == 13) {
			this.props.doAction('QUICKCALL_CHECK_TASK');
		}
	}
}

export default Store.connect(QuickCall, 'quickcall');