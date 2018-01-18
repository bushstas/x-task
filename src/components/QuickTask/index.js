import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormField from '../../ui/FormField';
import Dialog from '../../ui/Dialog';
import Icon from '../../ui/Icon';
import Store from 'xstore';
import TaskInfoForm from '../TaskInfoForm';
import TaskTerms from '../TaskTerms';
import TaskUsers from '../TaskUsers';
import MaskModeButton from '../MaskModeButton';
import TaskUrlResolver from '../TaskUrlResolver';

class QuickTask extends React.Component {
	render() {
		let {
			formData, 
			status, 
			importance, 
			type, 
			action, 
			taskInfoDict,
			taskUsersDict,
			info,
			layers,
			urlDialogData,
			urls = [],
			nohashes,
			noparams,
			execs,
			testers,
			termsData,
			difficulty,
			termsId,
			until,
			untilTimeLeft,
			untilNum,
			lockedTask,
			taskList
		} = this.props;

		let className = $classy(status, '', ['active', 'collapsed']);
	 	return (
	 		<div class="self $className">
				<Form onChange={this.handleFormChanged}>
					<FormField>
						<Input 
							classes="url"
							name="url"
							value={urls[0]}
							placeholder={dict.taskurl}
							onClick={this.handleUrlInputClick}
							readOnly/>
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
					<Button onClick={this.handleSubmit}>
						{dict.add_task}
					</Button>
				</Form>

				{!!urlDialogData && (
					<Dialog
						classes="~large"
						clickMaskToClose={true}
						onClose={this.handleUrlDialogClose}
						title={urlDialogData.dict.title}>
						<TaskUrlResolver 
							urls={urls}
							nohashes={nohashes}
							noparams={noparams}
							dict={urlDialogData.dict}
							onChange={this.handleChange}/>
					</Dialog>
				)}

				{!!termsData && (
					<TaskTerms
						difficulty={difficulty}
						termsId={termsId}
						until={until}
						untilTimeLeft={untilTimeLeft}
						untilNum={untilNum}
						dict={termsData}
						onSelect={this.handleSelectTerms}
						onClose={this.handleTermsClose}/>
				)}

				<div class="importance-panel .panel" onClick={this.handleChangeParam}>					
					{this.renderButtons(icons.task_imp, importance, 'importance', 'importance')}

					<Icon 
						classes="lock-task $lockedTask?.active"
						title={dict.locked}
						icon="locked"
						onClick={this.handleLockTaskClick}/>
				</div>

				<div class="type-panel .panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_type, type, 'type', 'category')}
				</div>
				
				<div class="action-panel .panel" onClick={this.handleChangeParam}>
					{this.renderButtons(icons.task_act, action, 'action', 'action')}
				</div>

				<div class="element-panel .panel" onClick={this.handleExpandClick}>
					{this.elementButtons}
					{this.prevElementButton}
					{this.nextElementButton}
					{this.uiElementPanel}
				</div>

				<div class="bottom-panel .panel">
					{action != 'note' && (
						<Icon icon="assign"
							classes=".inline-icon"
							title={dict.assign_executors}
							onClick={this.handleAssignClick}/>
					)}

					<Icon icon="task_info"
						classes=".inline-icon"
						title={dict.task_info}
						onClick={this.handleInfoShown}/>

					<Icon icon="terms"
						classes=".inline-icon"
						title={dict.terms}
						onClick={this.handleTermsShown}/>
				</div>

				<div class="top-panel .panel" onClick={this.handleExpandClick}>
					<Icon 
						title={dict.layer}
						icon={layers ? 'layer_off' : 'layer'}
						classes=".white-icon .inline-icon"
						onClick={this.handleLayersClick}/>


					<MaskModeButton/>

					<Icon icon="up"
						classes=".white-icon .panel-up .inline-icon"
						onClick={this.handleExpandClick}/>

					<Icon icon="close"
						title={dict.cancel_task}
						classes=".white-icon .inline-icon"
						onClick={this.handleCloseClick}/>
				</div>

				{taskInfoDict && (
					<TaskInfoForm
						formData={info}
						taskList={taskList}
						dict={taskInfoDict}
						onFormChange={this.handleInfoChange}
						onListChange={this.handleListChange}
						onClose={this.handleInfoClose}/>
				)}

				{taskUsersDict && (
					<TaskUsers
						execs={execs}
						testers={testers}
						dict={taskUsersDict}
						onSelect={this.handleSelectUser}
						onClose={this.handleUsersClose}/>
				)}
			</div>
		)
	}

	get uiElementPanel() {
		if (this.props.uiPanelShown) {
			return (
				<div class="ui-panel .panel">
					{this.uiButtons}
				</div>
			)
		}
	}

	get uiButtons() {
		let items = icons.ui || {};
		let keys = Object.keys(items);
		return keys.map((value) => {
			return  (
				<Icon 
					classes=".inline-icon"
					data-type={value}
					title={dict.insertion + ': ' + dict[value]}
					key={value}
					onClick={this.handleAddElementClick}>
					{items[value]}
				</Icon>
			)
		})
	}

	get hasPrevNext() {
		let {visualElements} = this.props;
		return Object.keys(visualElements).length > 0;
	}

	get elementButtons() {
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

	get prevElementButton() {
		if (this.hasPrevNext) {
			return (	
				<div class="prev-element-panel .panel" onClick={this.handlePrevButtonClick}>
					<Icon 
						title={dict.left}
						icon="left"
						classes=".white-icon"/>
				</div>
			)
		}
	}

	get nextElementButton() {
		if (this.hasPrevNext) {
			return (	
				<div class="next-element-panel .panel" onClick={this.handleNextButtonClick}>
					<Icon 
						title={dict.right}
						icon="right"
						classes=".white-icon"/>
				</div>
			)
		}
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
			switch (paramName) {
				case 'action':
				let {type} = this.props;
					switch (type) {
						case 'prototype':
						case 'design':
							if (value == 'removing' || value == 'repairing' || value == 'debugging') {
								return;
							}
						break;
						case 'text':
							if (value == 'repairing' || value == 'debugging') {
								return;
							}
						break;
						case 'html':
							if (value == 'debugging') {
								return;
							}
						break;
						case 'style':
							if (value != 'editing' && value != 'note') {
								return;
							}
						break;
						case 'project':
							if (value != 'planning' && value != 'note') {
								return;
							}
						break;
					}
				break;
			}
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
		if (param) {
			let {type} = this.props;
			let props = {[param]: value || true}
			if (type != value && param == 'type') {
				props.action = null;
			}
			this.props.doAction('QUICKTASK_CHANGE_PARAM', props);
		}
	}

	handleFormChanged = (data) => {
		this.props.dispatch('QUICKTASK_FORM_DATA_CHANGED', data);
	}

	handleAddElementClick = (e) => {
		e.stopPropagation();
		let {target: {dataset: {type}}} = e;
		if (type != 'ui') {
			this.props.doAction('QUICKTASK_ADD_ELEMENT', type);
		} else {
			this.props.doAction('QUICKTASK_CHANGE_PARAM', {uiPanelShown: !this.props.uiPanelShown});
		}
	}

	handleExpandClick = () => {
		this.props.doAction('QUICKTASK_UNSET_ACTIVE_ELEMENT');
	}

	handleCloseClick = (e) => {
		e.stopPropagation();
		this.props.doAction('QUICKTASK_CANCEL');
	}

	handleInfoShown = () => {
		this.props.doAction('QUICKTASK_SHOW_INFO_FORM');
	}

	handleTermsShown = () => {
		this.props.doAction('QUICKTASK_SHOW_TERMS');
	}

	handleAssignClick = () => {
		this.props.doAction('QUICKTASK_SHOW_USERS');	
	}

	handleInfoClose = () => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {taskInfoDict: false});
	}

	handleTermsClose = () => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {termsData: null});
	}

	handleSelectTerms = (value, param) => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {[param]: value});
		if (param == 'until') {
			this.props.doAction('QUICKTASK_LOAD_UNTIL_DATE', value);
		}
	}

	handleUsersClose = () => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {taskUsersDict: false});
	}

	handleInfoChange = (info) => {
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {info});
	}

	handleListChange = (name, value) => {
		let key = name.replace(/^[^\d]+/g, '');
		let {taskList = {}} = this.props;
		taskList[key] = value;
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {taskList});
	}

	handleSelectUser = (role, token, assigned) => {
		this.props.dispatch('QUICKTASK_USER_ASSIGNED', {token, assigned, role});
	}

	handleLayersClick = (e) => {
		e.stopPropagation();
		let {layers} = this.props;
		layers = !layers;
		this.props.doAction('QUICKTASK_CHANGE_PARAM', {layers});
	}

	handlePrevButtonClick = (e) => {
		e.stopPropagation();
		let {currentElement, visualElements, bent} = this.props;
		let keys = Object.keys(visualElements);
		let count = keys.length;
		let idx = keys.indexOf(currentElement);
		idx--;
		if (idx < 0) {
			idx = count - 1;
		}
		currentElement = keys[idx];
		if (bent && visualElements[currentElement].type == 'mark') {
			idx--;	
			if (idx < 0) {
				idx = count - 1;
			}
			currentElement = keys[idx];
		}
		this.props.doAction('QUICKTASK_SET_ELEMENT_ACTIVE', currentElement);
	}

	handleNextButtonClick = (e) => {
		e.stopPropagation();
		let {currentElement, visualElements, bent} = this.props;
		let keys = Object.keys(visualElements);
		let count = keys.length;
		let idx = keys.indexOf(currentElement);
		idx++;
		if (idx >= count) {
			idx = 0;
		}
		currentElement = keys[idx];
		if (bent && visualElements[currentElement].type == 'mark') {
			idx++;	
			if (idx >= count) {
				idx = 0;
			}
			currentElement = keys[idx];
		}
		this.props.doAction('QUICKTASK_SET_ELEMENT_ACTIVE', currentElement);
	}

	handleUrlInputClick = () => {
		this.props.doAction('QUICKTASK_SHOW_URL_DIALOG');
	}

	handleUrlDialogClose = () => {
		this.props.dispatch('QUICKTASK_PARAM_CHANGED', {urlDialogData: null});
	}

	handleChange = (data) => {
		this.props.dispatch('QUICKTASK_PARAM_CHANGED', data);
	}

	handleSubmit = () => {
		this.props.doAction('QUICKTASK_SAVE');
	}

	handleLockTaskClick = () => {
		let {lockedTask} = this.props;
		this.props.dispatch('QUICKTASK_PARAM_CHANGED', {lockedTask: !lockedTask});
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(QuickTask, params);