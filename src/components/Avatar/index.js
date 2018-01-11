import React from 'react';
import {AVATAR_PATH} from '../../consts/avatar';
import UserInfo from '../UserInfo';

export default class Avatar extends React.Component {
	constructor() {
		super();
		this.state = {
			dialogShown: false
		}
	}

	render() {
		let {id, classes, userName} = this.props;
		let style = {
			backgroundImage: 'url(' + AVATAR_PATH + id + '.png)'
		}
		return (
			<div class="self $classes" title={userName}>
				<div class="inner" style={style} onClick={this.handleClick}/>
				{this.state.dialogShown && (
					<UserInfo 
						id={id}
						name={userName}
						onClose={this.handleDialogClose}/>
				)}
			</div>
		)
	}

	handleClick = () => {alert(111)
		this.setState({dialogShown: true});
	}

	handleDialogClose = () => {
		this.setState({dialogShown: false});	
	}
}