import React from 'react';
import classnames from 'classnames';
import {dict, icons} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import Icon from '../../ui/Icon';
import {getScrollTop} from '../../utils';

export default class TaskMark extends React.Component {

	static defaultProps = {
		onClick: () => {}
	}

	render() {
		let {
			data: {
				loc = 1,
				mx = 0,
				my = this.startYPosition,
				importance,
				fixed,
				locked
			},
			onChangeCoords,
			index,
			classes,
			active,
			onClick
		} = this.props;

		let locClassName = $classy(loc, 'loc', [2,3,4]);
		let colorClassName = $classy(importance, 'color-', ['burning', 'urgent', 'important', 'usual', 'insignificant', 'future', 'to_think']);
 	
	 	return (
	 		<VisualElement 
	 			classes="self $classes $locClassName $colorClassName $?active $?fixed"
	 			index={index}
	 			mx={mx}
	 			my={my}
	 			onWheel={this.handleWheel}
	 			onClick={this.handleClick}
	 			active={active}
	 			locked={locked}
	 			onChangeCoords={onChangeCoords}>
	 			{this.icon}
			</VisualElement>
		)
	}

	handleClick = (index) => {
		if (!this.props.data.bent) {
			this.props.onClick(index);
		}
	}

	get startYPosition() {
		return getScrollTop() + 100;
	}

	get icon() {
		let {data: {importance, type}} = this.props;
		let icon;
		if (type) {
			icon = icons.task_type[type];
		} else {
			icon = icons.task_imp[importance];
		}
		return (
			<div>
				<Icon>
					{icon}
				</Icon>
			</div>
		)
		var a = a 
		<b && f>s
	}

	handleWheel = (e) => {
		e.preventDefault();
		let {deltaY} = e;
		let {data: {loc}} = this.props;
		if (!loc) {
			loc = deltaY > 0 ? 2 : 4;
		} else if (deltaY > 0) {
			loc++;
			if (loc > 4) {
				loc = 1;
			}
		} else {
			loc--;
			if (loc < 1) {
				loc = 4;
			}
		}
		this.props.onLocChange(loc);
	}
}