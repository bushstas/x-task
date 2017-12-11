import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';

import './index.scss';

class VisualElements extends React.Component {

	render() {
		let {active, visualMode} = this.props;
	 	return (
	 		<div className="x-task-visual-elements">
				{this.elements}
			</div>
		)
	}

	get elements() {
		let {visualElements, currentElement} = this.props;
		if (visualElements instanceof Array) {
			return visualElements.map((element, i) => {
				let {type, data} = element;
				let props = {
					key: i,
					index: i,
					data,
					active: i == currentElement,
					onChangeCoords: this.handleChangeCoords,
					onClick: this.handleClick
				}
				switch (type) {
					case 'mark': 
						props.onLocChange = this.handleLocChange;
						return (
							<TaskMark {...props}/>
						)
					break;
				}
			});
		}
	}

	handleChange(data) {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', data);
	}

	handleChangeCoords = (mx, my) => {
		this.handleChange({mx, my});
	}

	handleLocChange = (loc) => {
		this.handleChange({loc});
	}

	handleClick = (index) => {
		this.props.dispatch('QUICKTASK_ELEMENT_SET_ACTIVE', index);
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);