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
					onClick={this.handleAddMarkClick}
					title={dict.add_mark}/>
				

				<div className="x-task-importance-panel" onClick={this.handleSelectImportance}>
					<Icon icon="assign" 
						classes="x-task-assign-button"
						title={dict.assign_executors}/>

					{this.renderButtons(icons.task_imp, importance)}
				</div>

				<div className="x-task-type-panel" onClick={this.handleSelectType}>
					{this.renderButtons(icons.task_type, type)}
				</div>
				
				<div className="x-task-action-panel" onClick={this.handleSelectAction}>
					{this.renderButtons(icons.task_act, action)}
				</div>				
			</div>
		)
	}

	renderButtons(items, param) {
		let keys = Object.keys(items || {});
		return keys.map((value) => {
			return  (
				<Icon 
					classes={classnames(param == value ? 'active' : '')}
					data-value={value}
					title={dict[value]}
					key={value}>
					{items[value]}
				</Icon>
			)
		})
	}

	handleSelectImportance = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {importance: value});
		}
	}

	handleSelectType = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {type: value});
		}
	}

	handleSelectAction = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {action: value});
		}
	}

	handleFormChanged = (data) => {
		this.props.dispatch('QUICKTASK_FORM_DATA_CHANGED', data);
	}

	handleAddMarkClick = () => {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_ADDED', {type: 'mark', data: {}});
	}


}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);