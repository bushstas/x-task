import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Team from '../Team';
import ActionButtons from '../ActionButtons';
import Store from 'xstore'

import './index.scss';

class Users extends React.Component {

	componentDidMount() {
		this.props.doAction('USERS_LOAD');
	}

	render() {
		let {fetching} = this.props;
	 	return (
	 		<Loader fetching={fetching} classes="x-task-users">
				{this.tabs}
				{this.actionButtons}
			</Loader>
		)
	}

	get tabs() {		
		return (
			<Tabs onSelect={this.handleSelectTab}>
				<Tab caption={dict[this.teamTabCaption]} value="users">
					{this.team}
				</Tab>
				<Tab caption={dict.invitations} value="invitations">
					2
				</Tab>
				<Tab caption={dict.roles} value="roles">
					3
				</Tab>
			</Tabs>
		)
	}

	get teamTabCaption() {
		let {userFormShown} = this.props;
		if (userFormShown == 'edit') {
			return 'user_editing';
		}
		if (userFormShown == 'add') {
			return 'user_adding';
		}
		return 'team';
	}

	get team() {
		return <Team/>
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

				<Button data-value="add_user" width="100">
					{dict.add}
				</Button>

				<Button data-value="save_user" data-token={editedUserToken} width="100">
					{dict.save}
				</Button>

				<Button classes="x-task-cancel-button" data-value="cancel" width="100">
					{dict.cancel}
				</Button>
			</ActionButtons>
		)
	}

	get shownButtons() {
		let {activeTab} = this.props;
		switch (activeTab) {
			case 'users': {
				let {userFormShown} = this.props;
				if (userFormShown == 'edit') {
					return ['save_user', 'cancel'];
				}
				if (userFormShown == 'add') {
					return ['add_user', 'cancel'];
				}
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
export default Store.connect(Users, params);