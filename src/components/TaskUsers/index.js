import React from 'react';
import Avatar from '../Avatar';
import Dialog from '../../ui/Dialog';
import Checkbox from '../../ui/Checkbox';
import {dict as dictionary} from '../../utils/Dictionary';

export default class TaskUsers extends React.Component {
	render() {
		let {onClose, dict} = this.props;
		let {users: {proper, rest, testers}} = dict;
		return (
			 <Dialog title={dict.title}
	            onClose={onClose}
	            clickMaskToClose={true}
	            classes="dialog::large self">
	            
	           	<table cellPadding="0" cellSpacing="0">
		           	<tbody>
			           	<tr>
			           		<td>
			           			{this.renderUsers(proper, dict.proper)}
			           			{this.renderUsers(rest, dict.rest)}
			           		</td>
			           		{testers && (
			           			<td>
			           				{this.renderUsers(testers, dict.testers)}
			           			</td>
			           		)}
			        	</tr>
			        </tbody>
	           	</table>
	        </Dialog>
		)
	}

	renderUsers(users, caption) {
		return (
			<div class="block">
				<div class="caption">
	       			{caption}
	       		</div>
	       		<div class="users">
	       			{users.length > 0 ? 
	       				users.map(this.renderUser) :
	       				this.none
	       			}
	       		</div>
			</div>
		)
	}

	get none() {
		return (
			<div class="none">
				{this.props.dict.none}
			</div>
		)
	}

	renderUser = (user) => {
		let {onSelect, execs = [], testers = []} = this.props;
		let list = user.tester ? testers : execs;
		let checked = list.indexOf(user.token) > -1;
		return (
			<div class="user $?checked" key={user.token}>
				<Checkbox 
					name={user.tester ? 'tester' : 'exec'}
					checked={checked}
					value={user.token}
					onChange={onSelect}>
					<Avatar
						id={user.avatar_id}
						userId={user.id}
						userName={user.name}/>
					<div class="name">
						{user.name}
					</div>
					<div class="role">
						{dictionary[user.spec ? user.spec : user.role]}
					</div>
				</Checkbox>
			</div>
		)
	}


}