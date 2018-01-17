import React from 'react';
import Icon from '../Icon';
import Dialog from '../Dialog';
import Store from 'xstore';
import {dict, icons} from '../../utils/Dictionary';

class Tooltip extends React.PureComponent {
	render() {
		let {tooltip, dark} = this.props;
		let icon = dark ? 'tooltip2' : 'tooltip';
		return (
			<span class="self">
				<Icon onClick={this.handleClick}>
					{icons[icon]}
				</Icon>
				{!!tooltip && (
					<Dialog
						title={dict.tooltip}
						classes="~middle"
						clickMaskToClose={true}
						onClose={this.handleClose}>
						{this.content}
					</Dialog>
				)}
			</span>
		)
	}

	get content() {
		let {tooltip} = this.props;
		return tooltip.map((item, i) => {
			if (typeof item == 'string') {
				return item;
			}
			switch (item.type) {
				case 'cap':
					return (
						<div class="caption1" key={i}>
							{item.value}
						</div>
					)

				case 'cap2':
					return (
						<div class="caption2" key={i}>
							{item.value}
						</div>
					)

				case 'p':
					return (
						<div class="paragraph" key={i}>
							{item.value}
						</div>
					)

				case 'c':
					return (
						<div class="code" key={i}>
							{
								item.value instanceof Array ? 
									this.renderLines(item.value) : 
									item.value}
						</div>
					)

				case 'br':
					return (
						<div class="space" key={i}/>
					)
			}
			return (
				<div class="line" key={i}>
					{item.value}
				</div>
			)
		});
	}

	renderLines(lines) {
		return lines.map((line, i) => {
			return (
				<div key={i}>
					{line}
				</div>
			)
		});
	}

	handleClick = () => {
		let {children: name} = this.props;
		if (name) {
			this.props.doAction('TOOLTIP_SHOW', name);
		}
	}

	handleClose = () => {
		this.props.dispatch('TOOLTIP_CLOSED');
	}
}

let params = {
	has: 'tooltip',
	flat: true
}
export default Store.connect(Tooltip, params);