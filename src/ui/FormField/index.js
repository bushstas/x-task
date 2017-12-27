import React from 'react';
import Input from '../Input';
import Select from '../Select';
import Checkboxes from '../Checkboxes';
import Radios from '../Radios';
import Tooltip from '../Tooltip';

const INPUT_TYPES = [
	Input,
	Select,
	Checkboxes,
	Radios
];

export default class FormField extends React.PureComponent {

	render() {
		let {classes} = this.props;
		return (
			<div class="self $classes">
				{this.caption}
				{this.control}
			</div>
		)
	}

	get caption() {
		let {caption} = this.props;
		if (caption) {
			return (
				<div class="caption">
					{caption}
					{this.tooltip}
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

	get tooltip() {
		let {tooltip} = this.props;
		if (tooltip) {
			return (
				<Tooltip>
					{tooltip}
				</Tooltip>
			)
		}
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