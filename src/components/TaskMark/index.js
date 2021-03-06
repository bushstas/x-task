import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import VisualElement from '../VisualElement';
import Icon from '../../ui/Icon';
import {handleWheel} from '../../utils/MouseHandlers';
import {DEFAULT_SIZES} from '../../consts/max_sizes';

const TYPE = 'mark';

export default class TaskMark extends React.Component {

	static defaultProps = {
		onClick: () => {}
	}

	render() {
		let {data: {loc = 1}, taskImportance} = this.props;
		let locClassName = $classy(loc, 'loc', [2,3,4]);
		let colorClassName = $classy(taskImportance, 'color-', ['burning', 'urgent', 'important', 'usual', 'insignificant', 'future', 'to_think']);
 	
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			classes="self $locClassName $colorClassName"
	 			onWheel={this.handleWheel}
	 			type={TYPE}
	 			resizers={true}
	 			set="2"
	 			onClick={this.handleClick}>
	 			{this.icon}
			</VisualElement>
		)
	}

	handleClick = (index) => {
		if (!this.props.bent) {
			this.props.onClick(index);
		}
	}

	get defaultWidth() {
		return DEFAULT_SIZES[TYPE] && DEFAULT_SIZES[TYPE].width;
	}

	get defaultHeight() {
		return DEFAULT_SIZES[TYPE] && DEFAULT_SIZES[TYPE].height;
	}

	get icon() {
		let {data = {}, taskImportance, taskType} = this.props;
		let {
			width = this.defaultWidth,
			height = this.defaultHeight
		} = data;
		let icon;
		if (taskType) {
			icon = icons.task_type[taskType];
		} else {
			icon = icons.task_imp[taskImportance];
		}
		let fontSize = Math.round(width / 2);
		let marginLeft = -Math.round((fontSize - width / 20) / 2) + 'px';
		let marginTop = -Math.round((fontSize) / 2) + 'px';
		fontSize += 'px';
		let style = {
			fontSize,
			lineHeight: fontSize,
			marginLeft,
			marginTop
		}
		return (
			<div>
				<Icon style={style}>
					{icon}
				</Icon>
			</div>
		)
	}

	handleWheel = (e) => {
		this.props.onChange(
			handleWheel(e, TYPE, this.props.data)
		);
	}
}