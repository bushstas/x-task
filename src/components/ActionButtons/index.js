import React from 'react';
import Button from '../../ui/Button';

import './index.scss';

export default class ActionButtons extends React.Component {

	render() {
		let {buttonsShown} = this.props;
	 	return (
	 		<div className="x-task-action-buttons">
	 			{this.content}
	 		</div>
	 	)
	}

	get content() {
		let {children} = this.props;
		if (!(children instanceof Array)) {
			children = [children];
		}
		return this.renderChildren(children);
	}

	renderChildren(children) {
		if (children instanceof Array) {
			return children.map((child, i) => {
				return this.renderChild(child, i);
			});
		}
		return children;
	}

	renderChild(child, i) {
		if (React.isValidElement(child)) {
			let props = {
				key: i
			};
			if (child.type == Button) {
				props.onClick = this.handleButtonClick;
			}
			return React.cloneElement(
				child,
				props,
				this.renderChildren(child.props.children)
			);
		}
		return child;
	}

	handleButtonClick = (e) => {
		console.log(e.target)
	}
}