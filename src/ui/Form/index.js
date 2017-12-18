import React from 'react';
import FormField from '../FormField';
import FormSubmit from '../FormSubmit';

export default class Form extends React.Component {
	static defaultProps = {
		onControlChange: () => {},
		onChange: () => {},
		onSubmit: () => {}
	}

	constructor(props) {
		super();
		this.state = {
			formData: props.data || {}
		};
	}

	render() {
		let {classes} = this.props;
		return (
			<div class="self $classes">
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
			if (child.type == FormField) {
				if (child.props.isPresent === false) {
					return;
				}
				props.onChange = this.handleControlChange;
				props.onValidate = this.props.onChange;
			} else  if (child.type == FormSubmit) {
				props.onClick = this.handleSubmit;
			}
			return React.cloneElement(
				child,
				props,
				this.renderChildren(child.props.children)
			);
		}
		return child;
	}

	handleControlChange = (name, value) => {
		let {onControlChange, onChange} = this.props;
		onControlChange(name, value);
		let {formData} = this.state;
		formData[name] = value;
		onChange(formData);
	}

	handleSubmit = () => {
		let {formData} = this.state;
		this.props.onSubmit(formData);
	}
}