import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';
import Icon from '../../ui/Icon';
import Store from 'xstore';
import TaskInfoForm from '../TaskInfoForm';

class QuickTask extends React.Component {

	render() {
		let {
			formData, 
			status, 
			importance, 
			type, 
			action, 
			taskInfoShown,
			info
		} = this.props;
		let className = $classy(status, '', ['active', 'collapsed']);
	 	return (
	 		<div class="self $className">
				<Form onChange={this.handleFormChanged}>
					<FormField>
						<Input 
							name="url"
							value={formData.url}
							placeholder={dict.taskurl}/>
					</FormField>

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

				<div class="importance-panel .panel" onClick={this.handleChangeParam}>					
					{this.renderButtons(icons.task_imp, importance, 'importance', 'importance')}
				</div>

				<div class="type-panel .panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_type, type, 'type', 'category')}
				</div>
				
				<div class="action-panel .panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_act, action, 'action', 'action')}
				</div>

				<div class="element-panel .panel" onClick={this.handleExpandClick}>
					{this.renderElementButtons()}
				</div>

				<div class="bottom-panel .panel">
					<Icon icon="assign"
						classes=".inline-icon"
						title={dict.assign_executors}/>

					<Icon icon="task_info"
						classes=".inline-icon"
						title={dict.task_info}
						data-param="taskInfoShown"
						onClick={this.handleChangeParam}/>
				</div>

				<div class="top-panel .panel">
					<Icon icon="up"
						classes=".white-icon .panel-up .inline-icon"
						onClick={this.handleExpandClick}/>

					<Icon icon="close"
						title={dict.cancel_task}
						classes=".white-icon .inline-icon"
						onClick={this.handleCloseClick}/>
				</div>

				{taskInfoShown && (
					<TaskInfoForm
						formData={info}
						onFormChange={this.handleInfoChange}
						onClose={this.handleInfoClose}/>
				)}
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
					classes=".white-icon .inline-icon"
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
					classes="$param==value?.active"
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
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {[param]: value || true});
		}
	}

	handleFormChanged = (data) => {
		this.props.dispatch('QUICKTASK_FORM_DATA_CHANGED', data);
	}

	handleAddElementClick = (e) => {
		e.stopPropagation();
		let {target: {dataset: {type}}} = e;
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_ADDED', {type, data: {}});
	}

	handleExpandClick = () => {
		this.props.dispatch('QUICKTASK_ACTIVE_ELEMENT_UNSET');
	}

	handleCloseClick = () => {
		this.props.doAction('QUICKTASK_CANCEL');
	}

	handleInfoClose = () => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {'taskInfoShown': false});
	}

	handleInfoChange = (info) => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {info});
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);