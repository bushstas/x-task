import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';
import AreaSelection from '../../components/AreaSelection';
import Drawing from '../../components/Drawing';
import Text from '../../components/Text';

class VisualElements extends React.Component {

	render() {
	 	return (
	 		<div class=".visual-elements">
				{this.mask}
				{this.elements}
			</div>
		)
	}

	get mask() {
		let {currentElement} = this.props;
		if (typeof currentElement == 'number' && currentElement >= 0) {
			return (
				<div class="mask" onMouseDown={this.handleBodyMouseDown}/>
			)
		}
	}

	get elements() {
		let {
			visualElements,
			currentElement,
			bent,
			importance: taskImportance,
			type: taskType
		} = this.props;
		if (visualElements instanceof Array) {
			return visualElements.map((element, i) => {
				let {type, data} = element;
				let props = {
					key: i,
					index: i,
					taskType,
					taskImportance,
					bent,
					data,
					active: i == currentElement,
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

	handleBodyMouseDown = (e) => {
		let {visualElement: {data: {here}}} = this.props;
		if (here) {
			let {nativeEvent: {pageX: x, pageY: y}} = e;
			this.props.doAction('QUICKTASK_RELOCATE_ELEMENT', {x, y});
		} else {
			this.props.dispatch('QUICKTASK_ACTIVE_ELEMENT_UNSET');
		}		
	}

	handleChange = (data) => {
		this.props.doAction('QUICKTASK_CHANGE_VISUAL_ELEMENT', data);
	}

	handleClick = (index) => {
		if (typeof index == 'number') {
			this.props.dispatch('QUICKTASK_ELEMENT_SET_ACTIVE', index);
		}
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);