import React from 'react';

export default class Button extends React.Component {
	static defaultProps = {
		onClick: () => {}
	}

	render() {
		let {classes, children, href, onClick, disabled, width, ...others} = this.props;
		classes = $classy('self $classes $?disabled');
		let props = {
			className: classes,
			onClick: this.handleClick,
			...others
		};
		if (width) {
			props.style = {
				minWidth: width + 'px'
			}
		}
		if (href) {
			return (
				<a href={href} {...props}>
					{children}
				</a>
			)
		}
		return (
			<div {...props}>
				{children}
			</div>
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		let {value, disabled} = this.props;
		if (disabled) return;
		this.props.onClick(value || e);
	}
}