import React from 'react';

import './index.scss';

export class Tabs extends React.PureComponent {
	static defaultProps = {
		onSelect: () => {}
	}

	constructor() {
		super();
		this.state = {
			activeTab: 0
		};
	}
	
	render() {
		let {activeTab} = this.state;
		let {children, classes} = this.props;
		if (!(children instanceof Array)) {
			children = [children];
		}
		return (
			<div class="self $classes">
				<div class="menu">
					{children.map((child, i) => {
						if (child instanceof Object && child.type == Tab) {
							let props = {
								key: i,
								index: i,
								onSelect: this.handleSelectTab,
								classes: "$activeTab==i?active",
								...child.props
							};
							return React.cloneElement(child, props, null);
						}
					})}
				</div>
				<div class="content">
					{children.map((child, i) => {
						if (activeTab == i && child instanceof Object && child.type == Tab) {
							return child.props.children;
						}
					})}
				</div>
			</div>
		)
	}

	handleSelectTab = (e) => {
		let index = e.target.getAttribute('data-index');
		let value = e.target.getAttribute('data-value');
		if (index) {
			let {activeTab} = this.state;
			if (activeTab != index) {
				this.setState({activeTab: index});
				this.props.onSelect(value || index);
			}			
		}
	}
}

export function Tab({caption, index, onSelect, classes, value}) {
	return (
		<div class="tab $classes" data-index={index} data-value={value} onClick={onSelect}>
			{caption}
		</div>
	)
}