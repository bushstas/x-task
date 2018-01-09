import React from 'react';

export class Tabs extends React.PureComponent {
	static defaultProps = {
		onSelect: () => {}
	}

	constructor(props) {
		super();
		this.state = {
			activeTab: props.value || 0
		};
	}
	
	render() {
		let {activeTab} = this.state;
		let {children, classes, simple, value: v} = this.props;
		if (!(children instanceof Array)) {
			children = [children];
		}
		return (
			<div class="self $classes">
				<div class="menu">
					{children.map((child, i) => {
						if (child instanceof Object && child.type == Tab) {
							let value = this.getValue(child.props.value, i);
							let props = {
								key: i,
								index: i,
								onSelect: this.handleSelectTab,
								classes: $classy("$activeTab==value ? active"),
								...child.props
							};
							return React.cloneElement(child, props, null);
						}
					})}
				</div>
				{!simple && (
					<div class="content">
						{children.map((child, i) => {
							let value = this.getValue(child.props.value, i);
							if (activeTab == value && child instanceof Object && child.type == Tab) {
								return child.props.children;
							}
						})}
					</div>
				)}
			</div>
		)
	}

	getValue(v, i) {
		let {activeTab} = this.state;
		let value = v || i;
		if (i == 0 && activeTab === 0 && v) {
			value = 0;
		}
		return value;
	}

	handleSelectTab = (index, value) => {
		value = value || index;
		let {activeTab} = this.state;
		if (activeTab != value) {
			this.setState({activeTab: value});
			this.props.onSelect(value);
		}
	}
}

export class Tab extends React.Component {
	render() {
		let {caption, classes, disabled} = this.props;
		return (
			<div class="tab $classes $?disabled" onClick={this.handleClick}>
				{caption}
			</div>
		)
	}

	handleClick = () => {
		let {index, onSelect, value, disabled} = this.props;
		if (!disabled) {
			onSelect(index, value);
		}
	}
}