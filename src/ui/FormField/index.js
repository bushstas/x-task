import React from 'react';
import classnames from 'classnames';
import Input from '../Input';
import Select from '../Select';

const INPUT_TYPES = [
	Input,
	Select
];

import './index.scss';

export default class FormField extends React.PureComponent {

	render() {
		let {classes} = this.props;
		return (
			<div className={classnames('x-task-form-field', classes)}>
				{this.caption}
				{this.control}
			</div>
		)
	}


	get caption() {
		let {caption} = this.props;
		if (caption) {
			return (
				<div className="x-task-form-field-caption">
					{caption}
				</div>
			)
		}
	}

	get control() {
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
			if (INPUT_TYPES.indexOf(child.type) > -1) {
				props.onChange = this.props.onChange;
				props.onValidate = this.props.onValidate;
			}
			return React.cloneElement(
				child,
				props,
				this.renderChildren(child.props.children)
			);
		}
		return child;
	}
}