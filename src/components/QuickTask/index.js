import React from 'react';
import classnames from 'classnames';
import {dict, icons} from '../../utils/Dictionary';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';
import Icon from '../../ui/Icon';
import Store from 'xstore';

import './index.scss';

class QuickTask extends React.Component {

	render() {
		let {formData, status, importance, type, action} = this.props;
	 	return (
	 		<div className={classnames('x-task-quick-task', status)}>
				<Form onChange={this.handleFormChanged}>
					<FormField>
						<Input 
							name="title"
							value={formData.title}
							placeholder={dict.title}/>
					</FormField>

					<FormField>
						<Input 
							name="description"
							value={formData.description}
							placeholder={dict.description}
							textarea/>
					</FormField>
					<Button>
						{dict.add_task}
					</Button>
				</Form>

				<div className="x-task-importance-panel x-task-quick-task-panel" onClick={this.handleChangeParam}>					
					{this.renderButtons(icons.task_imp, importance, 'importance', 'importance')}
				</div>

				<div className="x-task-type-panel x-task-quick-task-panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_type, type, 'type', 'category')}
				</div>
				
				<div className="x-task-action-panel x-task-quick-task-panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_act, action, 'action', 'action')}
				</div>

				<div className="x-task-element-panel x-task-quick-task-panel">
					{this.renderElementButtons()}
				</div>

				<div className="x-task-bottom-panel x-task-quick-task-panel">
					<Icon icon="assign"
						className="x-task-inline-icon"
						title={dict.assign_executors}/>

					<Icon icon="task_info"
						className="x-task-inline-icon"
						title={dict.task_info}/>
				</div>

				<div className="x-task-top-panel x-task-quick-task-panel">
					<Icon icon="up"
						classes="x-task-white-icon x-task-panel-up x-task-inline-icon"
						onClick={this.handleExpandClick}/>

					<Icon icon="close"
						title={dict.cancel_task}
						classes="x-task-white-icon x-task-inline-icon"
						onClick={this.handleExpandClick}/>
				</div>
			</div>
		)
	}

	renderElementButtons() {
		let {markElement, selectionElement} = this.props;
		let items = icons.task_el || {};
		let keys = Object.keys(items);
		return keys.map((value) => {
			let onlyOne;
			if (value == 'mark' && markElement !== null) {
				return;
			}
			if (value == 'selection' && selectionElement !== null) {
				return;
			}
			let title = this.getElementButtonTitle(value);
			return  (
				<Icon 
					classes="x-task-white-icon x-task-inline-icon"
					data-type={value}
					title={title}
					key={value}
					onClick={this.handleAddElementClick}>
					{items[value]}
				</Icon>
			)
		})
	}

	getElementButtonTitle(value) {
		let title = dict.insertion + ': ' + dict[value];
		switch (value) {
			case 'mark':
			case 'selection':
				let one = value == 'mark' ? dict.one1 : dict.one2;
				title += ' (' + dict.only_one + ' ' + one + ')';
			break;
		}
		return title;
	}

	renderButtons(items, param, paramName, title) {
		let keys = Object.keys(items || {});
		return keys.map((value) => {
			return  (
				<Icon 
					classes={classnames(param == value ? 'active' : '')}
					data-param={paramName}
					data-value={value}
					title={dict[title] + ': ' + dict[value]}
					key={value}>
					{items[value]}
				</Icon>
			)
		})
	}

	handleChangeParam = ({target: {dataset: {value, param}}}) => {
		if (param && value) {
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {[param]: value});
		}
	}

	handleFormChanged = (data) => {
		this.props.dispatch('QUICKTASK_FORM_DATA_CHANGED', data);
	}

	handleAddElementClick = ({target: {dataset: {type}}}) => {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_ADDED', {type, data: {}});
	}

	handleExpandClick = () => {
		this.props.dispatch('QUICKTASK_ACTIVE_ELEMENT_UNSET');
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);