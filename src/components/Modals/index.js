import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';
import Dialog from '../../ui/Dialog';

import TaskInfo from '../TaskInfo';
import TaskActions from '../TaskActions';

class Modals extends React.Component {	
	render() {
		let {modals} = this.props;
		return (
			<div class="self">
				{Object.keys(modals).map(this.renderModal)}
			</div>
		)	
	}

	renderModal = (key) => {
		let {modals} = this.props;
		let data = modals[key];
		let dialog;
		switch (key) {			
			case 'task_info':
				dialog = this.renderThisModal({
					name: key,
					title: dict.task_inf,
					content: (
						<TaskInfo 
							id={data.id}
							key="taskinfo"/>
					)
				});
			break;

			case 'task_actions':
				dialog = (
					<TaskActions 
						id={data.id}  
						loc={data.loc} 
						key="taskactions"/>
				)
			break;
		}
		return dialog;
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
		this.props.doAction('MODALS_HIDE', name);
	}
}

let params = {
	has: 'modals',
	flat: true
}
export default Store.connect(Modals, params);