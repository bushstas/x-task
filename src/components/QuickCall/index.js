import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import {addHandler, removeHandler} from '../../utils/EscapeHandler';

export default class QuickCall extends React.Component {
	constructor() {
		super();
		this.state = {
			value: ''
		}
	}

	componentDidMount() {
		addHandler(this.handleClose);
		this.handleClick();
	}

	componentWillUnmount() {
		removeHandler(this.handleClose);
	}

	render() {
		const {value} = this.state;
		return (
			<div class="self" onClick={this.handleClick}>
				<div class="mask" onClick={this.handleClose}/>
				<div class="content">
					<div class="title">
						{dict.quick_call}
					</div>
					<div class="number">
						#{value}
						<input 
							onKeyUp={this.handleKeyUp}
							ref="input"
							type="text"
							maxLength="4"
							value={value}
							onChange={this.handleChange}/>
					</div>
				</div>
			</div>
		)
	}

	handleClick = () => {
		this.refs.input.focus();
	}

	handleClose = () => {
		Store.doAction('MODALS_HIDE', 'quick_call');	
	}

	handleChange = ({target: {value}}) => {
		value = value.replace(/[^\d]/, '');
		this.setState({value});
	}

	handleKeyUp = ({keyCode}) => {
		if (keyCode == 13) {
			const {value} = this.state;
			Store.doAction('MODALS_SHOW', {name: 'task_info', props: {id: '#' + value}});
			this.handleClose();
		}
	}
}