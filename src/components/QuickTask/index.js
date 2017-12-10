import React from 'react';
import classnames from 'classnames';
import {dict} from '../../utils/Dictionary';
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
				<div className="x-task-importance-panel" onClick={this.handleSelectImportance}>
					<Icon classes="x-task-assign-button" title={dict.assign_executors}>
						supervisor_account
					</Icon>

					<Icon classes={classnames(importance == 'burning' ? 'active' : '')} data-value="burning" title={dict.burning}>
						whatshot
					</Icon>

					<Icon classes={classnames(importance == 'urgent' ? 'active' : '')} data-value="urgent" title={dict.urgent}>
						flash_on
					</Icon>

					<Icon classes={classnames(importance == 'important' ? 'active' : '')} data-value="important" title={dict.important}>
						alarm
					</Icon>

					<Icon classes={classnames(importance == 'usual' ? 'active' : '')} data-value="usual" title={dict.usual}>
						schedule
					</Icon>

					<Icon classes={classnames(importance == 'insignificant' ? 'active' : '')} data-value="insignificant" title={dict.insignificant}>
						hourglass_empty
					</Icon>

					<Icon classes={classnames(importance == 'future' ? 'active' : '')} data-value="future" title={dict.future}>
						turned_in_not
					</Icon>

					<Icon classes={classnames(importance == 'to_think' ? 'active' : '')} data-value="to_think" title={dict.to_think}>
						timer_off
					</Icon>
				</div>

				<div className="x-task-type-panel" onClick={this.handleSelectType}>
					<Icon classes={classnames(type == 'design' ? 'active' : '')} data-value="design" title={dict.design}>
						palette
					</Icon>

					<Icon classes={classnames(type == 'prototype' ? 'active' : '')} data-value="prototype" title={dict.prototype}>
						dashboard
					</Icon>

					<Icon classes={classnames(type == 'text' ? 'active' : '')} data-value="text" title={dict.text}>
						text_fields
					</Icon>

					<Icon classes={classnames(type == 'frontend' ? 'active' : '')} data-value="frontend" title={dict.frontend}>
						dvr
					</Icon>

					<Icon classes={classnames(type == 'backend' ? 'active' : '')} data-value="backend" title={dict.backend}>
						storage
					</Icon>

					<Icon classes={classnames(type == 'html' ? 'active' : '')} data-value="html" title={dict.html}>
						code
					</Icon>

					<Icon classes={classnames(type == 'test' ? 'active' : '')} data-value="test" title={dict.test}>
						done_all
					</Icon>

					<Icon classes={classnames(type == 'page' ? 'active' : '')} data-value="page" title={dict.page}>
						content_copy
					</Icon>

					<Icon classes={classnames(type == 'project' ? 'active' : '')} data-value="project" title={dict.project}>
						web
					</Icon>

					<Icon classes={classnames(type == 'style' ? 'active' : '')} data-value="style" title={dict.style}>
						format_color_fill
					</Icon>	
				</div>

				
				<div className="x-task-action-panel" onClick={this.handleSelectAction}>
					<Icon classes={classnames(action == 'developing' ? 'active' : '')} data-value="developing" title={dict.developing}>
						tab_unselected
					</Icon>

					<Icon classes={classnames(action == 'editing' ? 'active' : '')} data-value="editing" title={dict.editing}>
						mode_edit
					</Icon>

					<Icon classes={classnames(action == 'remaking' ? 'active' : '')} data-value="remaking" title={dict.remaking}>
						loop
					</Icon>

					<Icon classes={classnames(action == 'removing' ? 'active' : '')} data-value="removing" title={dict.removing}>
						block
					</Icon>

					<Icon classes={classnames(action == 'repairing' ? 'active' : '')} data-value="repairing" title={dict.repairing}>
						build
					</Icon>

					<Icon classes={classnames(action == 'debugging' ? 'active' : '')} data-value="debugging" title={dict.debugging}>
						tune
					</Icon>

					<Icon classes={classnames(action == 'planning' ? 'active' : '')} data-value="planning" title={dict.planning}>
						content_paste
					</Icon>

					<Icon classes={classnames(action == 'note' ? 'active' : '')} data-value="note" title={dict.note}>
						star_border
					</Icon>
				</div>
				
			</div>
		)
	}

	handleSelectImportance = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.dispatch('QUICKTASK_IMPORTANCE_CHANGED', value);
		}
	}

	handleSelectType = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.dispatch('QUICKTASK_TYPE_CHANGED', value);
		}
	}

	handleSelectAction = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.dispatch('QUICKTASK_ACTION_CHANGED', value);
		}
	}

	handleFormChanged = (data) => {
		this.props.dispatch('QUICKTASK_FORM_DATA_CHANGED', data);
	}


}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);