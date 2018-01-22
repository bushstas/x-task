import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Dialog from '../../ui/Dialog';

import TaskInfo from '../TaskInfo';

class Modals extends React.Component {	
	render() {
		let {shownModals = {}} = this.props;
		return (
			<div class="self">
				{Object.keys(shownModals).map(this.renderModal)}
			</div>
		)	
	}

	renderModal = (key) => {
		let {shownModals} = this.props;
		let {data = {}, dict:modalDict = {}} = shownModals[key];
		switch (key) {
			
			case 'task_info':
				return this.renderThisModal({
					name: key,
					title: dict.task_inf,
					content: <TaskInfo/>
				});
			break;
		}
		return <div/>
	}

	renderThisModal = (params) => {
		let {name, title, content} = params;
		let props = {
			key: name,
			name, 
			title,
			onClose: this.handleClose,
			clickMaskToClose: true
		};
		return (
			<Dialog classes="~large ~no-overflow" {...props}>
				{content}
			</Dialog>
		)
	}

	handleClose = (name) => {
		this.props.doAction('APP_HIDE_MODAL', name);
	}
}

let params = {
	has: 'app',
	flat: true
}
export default Store.connect(Modals, params);