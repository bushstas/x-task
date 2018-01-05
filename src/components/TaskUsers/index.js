import React from 'react';
import Dialog from '../../ui/Dialog';
import Checkbox from '../../ui/Checkbox';
import {dict as dictionary} from '../../utils/Dictionary';

export default class TaskUsers extends React.Component {
	render() {
		let {onClose, dict} = this.props;
		return (
			 <Dialog title={dict.title}
	            onClose={onClose}
	            clickMaskToClose={true}
	            classes="dialog::large self">
	            
	           	{this.proper}
	           	{this.rest}
	        </Dialog>
		)
	}

	get proper() {
		let {dict} = this.props;
		let {users: {proper}} = dict;
		return (
			<div class="block">
				<div class="caption">
	       			{dict.proper}
	       		</div>
	       		<div class="users">
	       			{proper.length > 0 ? 
	       				proper.map(this.renderUser) :
	       				this.none
	       			}
	       		</div>
			</div>
		)
	}

	get rest() {
		let {dict} = this.props;
		let {users: {rest}} = dict;
		return (
			<div class="block">
				<div class="caption">
	        		{dict.rest}
	        	</div>
	        	<div class="users">
	        		{rest.length > 0 ? 
	       				rest.map(this.renderUser) :
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
		let {onSelect, execs = []} = this.props;
		return (
			<div class="user" key={user.token}>
				<Checkbox 
					name="user"
					checked={execs.indexOf(user.token) > -1}
					value={user.token}
					onChange={onSelect}>
					{user.name}
					<span class="role">
						({dictionary[user.spec ? user.spec : user.role]})
					</span>
				</Checkbox>
			</div>
		)
	}


}