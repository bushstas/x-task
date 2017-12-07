import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default class Form extends React.Component {
	render() {
		let {classes} = this.props;
		return (
			<div className={classnames('x-task-form', classes)}>
				{this.content}
			</div>
		)
	}

	get content() {
		return 1111;
	}
}