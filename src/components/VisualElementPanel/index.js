import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Store from 'xstore';
import Icon from '../../ui/Icon';

class VisualElementPanel extends React.Component {

	render() {
		let {visualElement} = this.props;
	 	return !!visualElement ? (
	 		<div class="self .panel"
	 			onClick={this.handleClick}>
	 			{this.typeIcon}
	 			{this.buttons}
			</div>
		) : null
	}

	get typeIcon() {
		let {visualElement: {type}} = this.props;
		return  (
			<Icon 
				classes=".white-icon .element-type"
				title={dict[type]}>
				{icons.task_el[type]}
			</Icon>
		)
	}

	get buttons() {
		let {visualElement: {data}} = this.props;
		let items = icons.task_elac;
		let keys = Object.keys(items || {});
		return keys.map((value) => {
			switch (value) {
				case 'bind':
					if (!this.hasBindButton) {
						return;
					}
				break;
			}
			let isActive = this.isActive(data, value);
			return  (
				<Icon 
					classes=".white-icon $isActive?.active"
					data-action={value}
					title={dict[value]}
					key={value}>
					{items[value]}
				</Icon>
			)
		})
	}

	get hasBindButton() {
		let {currentType, markElement, selectionElement} = this.props;
		return (currentType == 'mark' || currentType == 'selection') &&
			   typeof markElement == 'number' && typeof selectionElement == 'number';
	}

	isActive(data, action) {
		switch (action) {
			case 'lock':
				return data.locked;

			case 'fix':
				return data.fixed;

			case 'bind':
				return this.props.bent;
		}
	}

	handleClick = ({target: {dataset: {action}}}) => {
		let {visualElement: {data}} = this.props;
		let props = {};
		if (action) {
			switch (action) {
				case 'lock':
					props = {locked: !data.locked};
				break;

				case 'fix':
					props = {fixed: !data.fixed};
				break;

				case 'bind':
					return this.props.doAction('QUICKTASK_CHANGE_PARAM', {bent: !this.props.bent});
				break;
			}
			this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', props);
		}
	}
}

const params = {
  has: 'quicktask:visualElement|selectionElement|markElement|bent|currentType',
  flat: true
}
export default Store.connect(VisualElementPanel, params);