import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Store from 'xstore';
import Icon from '../../ui/Icon';
import classnames from 'classnames';

import './index.scss';

class VisualElementPanel extends React.Component {

	render() {
		let {visualElement} = this.props;
	 	return !!visualElement ? (
	 		<div className="x-task-visual-element-panel x-task-quick-task-panel"
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
				classes="x-task-white-icon x-task-element-type"
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
			return  (
				<Icon 
					classes={classnames('x-task-white-icon', this.isActive(data, value) ? 'active' : '')}
					data-action={value}
					title={dict[value]}
					key={value}>
					{items[value]}
				</Icon>
			)
		})
	}

	isActive(data, action) {
		switch (action) {
			case 'lock':
				return data.locked;

			case 'fix':
				return data.fixed;

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
			}
			this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', props);
		}
	}
}

const params = {
  has: 'quicktask:visualElement',
  flat: true
}
export default Store.connect(VisualElementPanel, params);