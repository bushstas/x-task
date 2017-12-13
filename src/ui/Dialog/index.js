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
		let {onClose, children, className, titleContent} = this.props;
		return (
			<div class=".box $className">
				<div className=".mask" onClick={this.handleMaskClick}/>
				<div className=".self">
					<div className=".title">
						{this.title}
						{titleContent}
						
						<Icon icon="close" 
							onClick={onClose}
							className=".close"/>
					</div>
					<div className=".content">
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
				<span className=".logo">
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