import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';

import './index.scss';

class VisualElements extends React.Component {

	render() {
		let {active, visualMode} = this.props;
	 	if (!active && !visualMode) {
	 		return null;
	 	}
	 	return (
	 		<div className="x-task-visual-elements">
				{this.elements}
			</div>
		)
	}

	get elements() {
		let {visualElements} = this.props;
		if (visualElements instanceof Array) {
			return visualElements.map((element, i) => {
				let {type, data} = element;
				let props = {
					key: i,
					index: i,
					data,
					onChangeCoords: this.handleChangeCoords
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

	handleChangeCoords = (mx, my) => {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', {mx, my});
	}

	handleLocChange = (loc) => {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', {loc});
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);