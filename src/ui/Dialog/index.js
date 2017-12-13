import React from 'react';
import Icon from '../Icon';
import {dict} from '../../utils/Dictionary';

import './index.scss';

//with addedPrefix 'dialog';

export default class Dialog extends React.Component {
	static defailtProps = {
		onClose: () => {}
	}

	render() {
		let {onClose, children, className, titleContent} = this.props;
		return (
			<div className={"x-task-dialog-box " + className}>
				<div className="x-task-dialog-mask" onClick={this.handleMaskClick}/>
				<div className="x-task-dialog">
					<div className="x-task-dialog-title">
						{this.title}
						{titleContent}
						
						<Icon icon="close" 
							onClick={onClose}
							className="x-task-dialog-close"/>
					</div>
					<div className="x-task-dialog-content">
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
				<span className="x-task-dialog-logo">
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