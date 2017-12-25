import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';
import AreaSelection from '../../components/AreaSelection';
import Drawing from '../../components/Drawing';
import Text from '../../components/Text';
import {getElementSelectorPath} from '../../utils';

let currentSelectedElement;

class VisualElements extends React.Component {

	componentDidMount() {
		document.body.addEventListener('click', this.onBodyClick);
	}

	componentWillUnmount() {
		document.body.removeEventListener('click', this.onBodyClick);
	}

	render() {
	 	return (
	 		<div class=".visual-elements">
				{this.mask}
				{this.elements}
			</div>
		)
	}

	get mask() {
		if (this.isCurrentElement) {
			return (
				<div class="mask" onMouseDown={this.handleBodyMouseDown}/>
			)
		}
	}

	get isCurrentElement() {
		return !!this.props.currentElement;
	}

	get elements() {
		let {
			visualElements,
			currentElement,
			bent,
			importance: taskImportance,
			type: taskType,
			layers
		} = this.props;
		if (visualElements instanceof Object) {
			let keys = Object.keys(visualElements);
			return keys.map((key) => {
				let element = visualElements[key];
				let active = key == currentElement;
				if (layers && !active && this.isCurrentElement) {
					return;
				}
				let {type, data} = element;
				let props = {
					key: key,
					index: key,
					taskType,
					taskImportance,
					bent,
					data,
					active,
					onChange: this.handleChange,
					onClick: this.handleClick
				}
				switch (type) {
					case 'mark': 
						if (!bent) {
							return (
								<TaskMark {...props}/>
							)
						}
					break;

					case 'selection':
						if (bent) {
							let {markElement} = this.props;
							props.markProps = visualElements[markElement];
							props.bent = true;
						}
						return (
							<AreaSelection resizers={true} {...props}/>
						)

					case 'drawing':
						return (
							<Drawing resizers={true} {...props}/>
						)

					case 'descr':
						return (
							<Text resizers={true} {...props}/>
						)
				}
			});
		}
	}

	onBodyClick = (e) => {
		e.preventDefault();
		let selector = getElementSelectorPath(e.target);
		if (selector) {
			let element = document.body.querySelector(selector);
			if (element) {
				if (currentSelectedElement) {
					currentSelectedElement.style.outline = '';
				}
				let style = window.getComputedStyle(element);
				element.style.outline = '2px dotted red';
				currentSelectedElement = element;
			}
		}
	}

	handleBodyMouseDown = (e) => {
		let {visualElement} = this.props;
		if (visualElement instanceof Object) {
			let {data: {here}} = visualElement;
			if (here) {
				let {nativeEvent: {pageX: x, pageY: y}} = e;
				this.props.doAction('QUICKTASK_RELOCATE_ELEMENT', {x, y});
			} else {
				this.props.doAction('QUICKTASK_UNSET_ACTIVE_ELEMENT');
			}
		}
	}

	handleChange = (data) => {
		this.props.doAction('QUICKTASK_CHANGE_VISUAL_ELEMENT', data);
	}

	handleClick = (currentElement) => {
		if (currentElement) {
			this.props.doAction('QUICKTASK_SET_ELEMENT_ACTIVE', currentElement);
		}
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);