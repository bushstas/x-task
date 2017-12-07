import React from 'react';
import Icon from '../Icon';
import classnames from 'classnames';

import './index.scss';

export default class Dialog extends React.Component {
	render() {
		let {title, onClose, children, classes} = this.props;
		return (
			<div className={classnames('x-task-dialog-box', classes)}>
				<div className="x-task-dialog-mask" onClick={onClose}/>
				<div className="x-task-dialog">
					<div className="x-task-dialog-title">
						{title}
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
}