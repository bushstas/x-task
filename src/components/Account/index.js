import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import ActionButtons from '../ActionButtons';
import Store from 'xstore'

import './index.scss';

class Account extends React.Component {

	componentDidMount() {
		this.props.doAction('USERS_LOAD');
	}

	render() {
		let {fetching} = this.props;
	 	return (
	 		<Loader loaded={!fetching} classes="stretched">
				<div className="x-task-account">
					{this.tabs}
					{this.actionButtons}
				</div>
			</Loader>
		)
	}

	get tabs() {		
		return (
			<Tabs onSelect={this.handleSelectTab}>
				<Tab caption={dict.my_tasks} value="tasks">
					2
				</Tab>
				<Tab caption={dict.info} value="users">
					{this.info}
				</Tab>
				<Tab caption={dict.settings} value="users">
					{this.settings}
				</Tab>
			</Tabs>
		)
	}

	get info() {
		return 11111
	}

	get settings() {
		return 11111
	}

	get actionButtons() {
		let {editedUserToken} = this.props;
		return (
			<ActionButtons 
				buttonsShown={this.shownButtons}
				onAction={this.handleAction}>
				
				<Button data-value="create_user">
					{dict.create_user}
				</Button>

			</ActionButtons>
		)
	}

	get shownButtons() {
		let {activeTab} = this.props;
		switch (activeTab) {
			case 'users': {
				return ['create_user'];
			}
		}
		return [];
	}

	handleSelectTab = (activeTab) => {
		this.props.dispatch('USERS_TAB_CHANGED', activeTab);
	}

	handleAction = (action, data) => {
		switch (action) {
			case 'cancel': 
				return this.props.dispatch('USERS_CANCELED');

			case 'create_user': 
				return this.props.dispatch('USERS_ADDING_USER_FORM_SHOWN');
			
			case 'save_user': 
				return this.props.doAction('USERS_SAVE_USER', data);
			
		}
	}
}

const params = {
  has: 'users',
  flat: true
}
export default Store.connect(Account, params);