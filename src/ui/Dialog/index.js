import React from 'react';
import Icon from '../Icon';
import classnames from 'classnames';
import {dict} from '../../utils/Dictionary';

import './index.scss';

export default class Dialog extends React.Component {
	static defailtProps = {
		onClose: () => {}
	}

	render() {
		let {onClose, children, classes, titleContent} = this.props;
		return (
			<div className={classnames('x-task-dialog-box', classes)}>
				<div className="x-task-dialog-mask" onClick={this.handleMaskClick}/>
				<div className="x-task-dialog">
					<div className="x-task-dialog-title">
						{this.title}
						{titleContent}
						<Icon onClick={onClose} classes="x-task-dialog-close">
							close
						</Icon>
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
				<span className="x-task-dialog-title-logo">
					<Icon size="22">
						developer_board
					</Icon>
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