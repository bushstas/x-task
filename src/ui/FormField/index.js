import React from 'react';
import Input from '../Input';
import Select from '../Select';
import Checkboxes from '../Checkboxes';
import Checkbox from '../Checkbox';
import Radios from '../Radios';
import Radio from '../Radio';
import Tooltip from '../Tooltip';

const INPUT_TYPES = [
	Input,
	Select,
	Checkboxes,
	Checkbox,
	Radios,
	Radio
];

export default class FormField extends React.PureComponent {

	static defaultProps = {
		onChange: () => {},
		onValidate: () => {},
		onDispose: () => {}
	}

	render() {
		let {classes, hidden} = this.props;
		if (hidden) {
			return null;
		}
		return (
			<div class="self $classes">
				{this.caption}
				<div class="content">
					{this.control}
					{this.tooltip}
				</div>		
			</div>
		)
	}

	get caption() {
		let {caption} = this.props;
		if (caption) {
			return (
				<div class="caption">
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
				if (child instanceof Array) {
					return renderChildren(child);
				}
				return this.renderChild(child, i);
			});
		}
		return this.renderChild(children);
	}

	renderChild(child, i) {
		if (React.isValidElement(child)) {
			let props = {
				key: i
			};
			if (INPUT_TYPES.indexOf(child.type) > -1) {
				props.onChange = this.props.onChange;
				props.onValidate = this.props.onValidate;
				props.onDispose = this.props.onDispose;
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