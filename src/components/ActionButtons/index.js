import React from 'react';
import Button from '../../ui/Button';

import './index.scss';

export default class ActionButtons extends React.Component {
	static defaultProps = {
		onAction: () => {}
	}

	render() {
		let {buttonsShown} = this.props;
	 	return (
	 		<div class=".action-buttons">
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
		let {buttonsShown} = this.props;
		if (React.isValidElement(child)) {
			let props = {
				key: i
			};
			if (child.type == Button) {
				if (buttonsShown instanceof Array &&
					buttonsShown.indexOf(child.props['data-value']) == -1) {
					return;
				}
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

	handleButtonClick = ({target: {dataset: {value, ...data}}}) => {
		this.props.onAction(value, data);
	}
}