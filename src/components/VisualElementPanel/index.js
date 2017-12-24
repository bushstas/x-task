import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Store from 'xstore';
import ColorPanel from '../../components/ColorPanel';
import Icon from '../../ui/Icon';
import {setScrollTop} from '../../utils';
import {handleFixate} from '../../utils/MouseHandlers';

class VisualElementPanel extends React.Component {

	render() {
		let {visualElement} = this.props;
	 	return !!visualElement ? (
	 		<div class="self .panel"
	 			onClick={this.handleClick}
	 			onMouseDown={this.handleMouseDown}>
	 			{this.colorPanel}
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
				case 'cut':
					if (!this.hasCutButton) {
						return;
					}
				break;
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

	get colorPanel() {
		return (
			<ColorPanel onPickColor={this.handlePickColor}/>
		)
	}

	get hasCutButton() {
		let {currentType} = this.props;
		return currentType != 'mark';
	}

	get hasBindButton() {
		let {currentType, markElement, selectionElement} = this.props;
		return (currentType == 'mark' || currentType == 'selection') &&
			   typeof markElement == 'number' && typeof selectionElement == 'number';
	}

	isActive(data, action) {
		switch (action) {
			case 'cut':
				return data.cut;

			case 'lock':
				return data.locked;

			case 'fix':
				return data.fixed;

			case 'bind':
				return this.props.bent;
		}
	}

	handleMouseDown = (e) => {
		e.stopPropagation();
	}

	handlePickColor = ({target: {dataset: {color}}}) => {
		if (color) {
			this.dispatchChange({color});
		}
	}

	handleClick = ({target: {dataset: {action}}}) => {
		let {visualElement: {data}} = this.props;
		let props = {};
		if (action) {
			switch (action) {
				case 'cut':
					props = {cut: !data.cut};
				break;

				case 'lock':
					props = {locked: !data.locked};
				break;

				case 'fix': {
					props = handleFixate(data);
				}
				break;

				case 'bind':
					return this.props.doAction('QUICKTASK_CHANGE_PARAM', {bent: !this.props.bent});

				case 'find': {
					let {my} = data;
					if (typeof my == 'number') {
						setScrollTop(my - 100);
					}
				}
				break;

				case 'remove':
					return this.props.doAction('QUICKTASK_REMOVE_ELEMENT');
			}
			this.dispatchChange(props);
		}
	}

	dispatchChange(props) {
		this.props.doAction('QUICKTASK_CHANGE_VISUAL_ELEMENT', props);
	}
}

const params = {
  has: 'quicktask:visualElement|selectionElement|markElement|bent|currentType',
  flat: true
}
export default Store.connect(VisualElementPanel, params);