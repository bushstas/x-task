import React from 'react';
import {dict} from '../../utils/Dictionary';
import {Tabs, Tab} from '../../ui/Tabs';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import Team from '../Team';
import Store from 'xstore'
import {hasRight} from '../../utils/User';

class Users extends React.Component {

	render() {
	 	return (
	 		<div class="self">
				{this.addButton}
				{this.statusFilterTabs}
				{this.typeFilterTabs}
				{this.projectFilterTabs}
				{this.tabs}
			</div>
		)
	}

	get tabs() {
		let {usersActiveTab} = this.props;
		return (
			<Tabs 
				onSelect={this.handleSelectTab}
				classes="~absolute ~no-overflow"
				value={usersActiveTab}>
				<Tab caption={dict.team} value="team">
					<Team/>
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

	get typeFilterTabs() {
		let {usersActiveTab, typeFilter} = this.props;
		if (usersActiveTab == 'team') {
			return (
				<Tabs 
					onSelect={this.handleSelectTypeFilterTab}
					classes="filter-tabs"
					value={typeFilter}
					simple
					optional>
					<Tab caption={dict.admins} value="admins"/>
					<Tab caption={dict.execs} value="execs"/>
				</Tabs>
			)
		}
	}

	get statusFilterTabs() {
		let {usersActiveTab, statusFilter} = this.props;
		if (usersActiveTab == 'team') {
			return (
				<Tabs 
					onSelect={this.handleSelectStatusFilterTab}
					classes="filter-tabs"
					value={statusFilter}
					simple
					optional>
					<Tab caption={dict.free} value="free"/>
					<Tab caption={dict.busy} value="busy"/>
				</Tabs>
			)
		}
	}

	get projectFilterTabs() {
		let {usersActiveTab, projectFilter, project} = this.props;
		if (usersActiveTab == 'team') {
			return (
				<Tabs 
					onSelect={this.handleSelectProjectFilterTab}
					classes="filter-tabs"
					value={projectFilter}
					simple
					optional>
					<Tab caption={project.name} value="on"/>
				</Tabs>
			)
		}
	}

	get addButton() {
		let {usersActiveTab} = this.props;
		if (usersActiveTab == 'team') {
			if (hasRight('add_user')) {
				return (
					<div class="add" onClick={this.handleAddUserClick}>
						<Icon icon="add_user"/>
					</div>
				)
			}
		}
	}

	handleSelectTab = (usersActiveTab) => {
		this.props.doAction('TEAM_CHANGE', {usersActiveTab});
	}

	handleSelectTypeFilterTab = (typeFilter) => {
		this.props.doAction('TEAM_CHANGE', {typeFilter});
		this.props.doAction('TEAM_LOAD');
	}

	handleSelectStatusFilterTab = (statusFilter) => {
		this.props.doAction('TEAM_CHANGE', {statusFilter});	
		this.props.doAction('TEAM_LOAD');
	}

	handleSelectProjectFilterTab = (projectFilter) => {
		this.props.doAction('TEAM_CHANGE', {projectFilter});	
		this.props.doAction('TEAM_LOAD');
	}

	handleAddUserClick = () => {
		this.props.doAction('TEAM_SHOW_ADD_FORM');
	}
}

export default Store.connect(Users, 'app, team, user:project');