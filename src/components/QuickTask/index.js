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
		let {formData, active, importance, type, action} = this.props;
	 	return (
	 		<div className={classnames('x-task-quick-task', active ? 'active' : '')}>
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

				<Icon icon="mark"
					classes="x-task-add-mark"
					data-type="mark"
					onClick={this.handleAddElementClick}
					title={dict.add_mark}/>
				

				<div className="x-task-importance-panel" onClick={this.handleChangeParam}>
					<Icon icon="assign" 
						classes="x-task-assign-button"
						title={dict.assign_executors}/>

					{this.renderButtons(icons.task_imp, importance, 'importance')}
				</div>

				<div className="x-task-type-panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_type, type, 'type')}
				</div>
				
				<div className="x-task-action-panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_act, action, 'action')}
				</div>				
			</div>
		)
	}

	renderButtons(items, param, paramName) {
		let keys = Object.keys(items || {});
		return keys.map((value) => {
			return  (
				<Icon 
					classes={classnames(param == value ? 'active' : '')}
					data-param={paramName}
					data-value={value}
					title={dict[value]}
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
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);