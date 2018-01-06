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
							let value = child.props.value || i;
							if (i == 0 && activeTab === 0 && child.props.value) {
								value = 0;
							}
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
							let value = child.props.value || i;
							if (activeTab == value && child instanceof Object && child.type == Tab) {
								return child.props.children;
							}
						})}
					</div>
				)}
			</div>
		)
	}

	handleSelectTab = (e) => {
		let value = e.target.getAttribute('data-value');
		if (value) {
			this.setState({activeTab: value});
			this.props.onSelect(value);
			return;
		}
		let index = e.target.getAttribute('data-index');
		if (index) {
			let {activeTab} = this.state;
			if (activeTab != index) {
				this.setState({activeTab: index});
				this.props.onSelect(index);
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