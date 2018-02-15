import React from 'react';

export class Tabs extends React.Component {
	static defaultProps = {
		onSelect: () => {}
	}

	constructor(props) {
		super();
		this.state = {
			activeTab: props.value
		};
	}
	
	render() {
		let {activeTab} = this.state;
		let {children, classes, simple, value: v} = this.props;
		this.singles = [];
		if (!(children instanceof Array)) {
			children = [children];
		}
		return (
			<div class="self $classes">
				<div class="menu">
					{children.map((child, i) => {
						if (child instanceof Object && child.type == Tab) {
							let value = child.props.value;
							if (child.props.single) {
								this.singles.push(value);
							}
							let active;
							if (activeTab instanceof Array) {
								active = activeTab.indexOf(value) > -1;
							} else {
								active = activeTab == value;
							}
							let props = {
								key: i,
								index: i,
								onSelect: this.handleSelectTab,
								classes: $classy("$?active"),
								...child.props
							};
							return React.cloneElement(child, props, null);
						}
					})}
				</div>
				{!simple && (
					<div class="content">
						{children.map((child, i) => {
							if (child instanceof Object) {
								let value = child.props.value;
								let active;
								if (activeTab instanceof Array) {
									active = activeTab.indexOf(value) > -1;
								} else {
									active = activeTab == value;
								}
								if (active && child instanceof Object && child.type == Tab) {
									return child.props.children;
								}
							}
						})}
					</div>
				)}
			</div>
		)
	}

	handleSelectTab = (value, single) => {
		let {multiple, optional} = this.props;
		let {activeTab} = this.state;
		if (multiple) {
			if (!(activeTab instanceof Array)) {
				activeTab = [activeTab];
			}
			let idx = activeTab.indexOf(value);
			if (idx > -1) {
				if (single) {
					activeTab = [];
				} else {
					activeTab.splice(idx, 1);
				}
			} else {
				if (single) {
					activeTab = [value];
				} else {
					activeTab.push(value);
					for (let s of this.singles) {
						let i = activeTab.indexOf(s);
						if (i > -1) {
							activeTab.splice(i, 1);
						}
					}
				}

			}
		} else if (activeTab != value) {
			activeTab = value;
		} else if (optional) {
			activeTab = null;
		}
		this.setState({activeTab});
		this.props.onSelect(activeTab);
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
		let {onSelect, value, disabled, single} = this.props;
		if (!disabled) {
			onSelect(value, single);
		}
	}
}