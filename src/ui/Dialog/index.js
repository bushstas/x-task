import React from 'react';
import Icon from '../Icon';
import {dict} from '../../utils/Dictionary';
import {cn} from '../../utils/Cn';

import './index.scss';


export default class Dialog extends React.Component {
	static defailtProps = {
		onClose: () => {}
	}

	render() {
		let {onClose, children, classes, titleContent} = this.props;
		return (
			<div xPrefix="x-task-dialog" xcn=".box $classes ..fuck">
				<div xcn=".mask" onClick={this.handleMaskClick}/>
				<div xcn=".this">
					<div className=".title">
						{this.title}
						{titleContent}
						
						<Icon icon="close" 
							onClick={onClose}
							xcn=".close"/>
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
				<span className={cn.dialog(6)}>
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