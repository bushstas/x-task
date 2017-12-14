import React from 'react';
import Icon from '../Icon';
import {dict} from '../../utils/Dictionary';

import './index.scss';

with addedPrefix 'dialog';

export default class Dialog extends React.Component {
	static defailtProps = {
		onClose: () => {}
	}

	render() {
		let {onClose, children, classes, titleContent} = this.props;
		let a = 'fucking-shit';
		return (
			<div class=".box $classes .$a ..$a">
				<div class=".mask" onClick={this.handleMaskClick}/>
				<div class=".self">
					<div class=".title">
						{this.title}
						{titleContent}
						
						<Icon icon="close" 
							onClick={onClose}
							class=".close"/>
					</div>
					<div class=".content">
						{children}
					</div>
				</div>
			</div>
		)
	}

	get title() {
		let {title} = this.props;
		return (
			<div>
				<span class=".logo">
					<Icon size="22" icon="logo"/>
					{dict.logo}
				</span>
				{title}
			</div>
		);
	}

	handleMaskClick = () => {
		let {onClose, clickMaskToClose} = this.props;
		if (clickMaskToClose) {
			onClose();
		}
	}
}