import React from 'react';
import classnames from 'classnames';

import './index.scss';

export class Tabs extends React.Component {
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
			<div className={classnames('x-task-tabs', classes)}>
				<div className="x-task-tabs-menu">
					{children.map((child, i) => {
						if (child instanceof Object && child.type == Tab) {
							let props = {
								key: i,
								index: i,
								onSelect: this.handleSelectTab,
								classes: activeTab == i ? 'active' : '',
								...child.props
							};
							return React.cloneElement(child, props, null);
						}
					})}
				</div>
				<div className="x-task-tabs-content">
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
		if (index) {
			this.setState({activeTab: index});
		}
	}
}

export function Tab({caption, index, onSelect, classes}) {
	return (
		<div className={classnames('x-task-tab', classes)} data-index={index} onClick={onSelect}>
			{caption}
		</div>
	)
}