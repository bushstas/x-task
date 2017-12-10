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
				switch (element.type) {
					case 'mark': 
						return (
							<TaskMark 
								key={i}
								index={i}
								data={element.data}
								onChangeCoords={this.handleChangeCoords}
								onLocChange={this.handleLocChange}/>
						)
					break;
				}
			});
		}
	}

	handleChangeCoords = (index, mx, my) => {
		this.props.dispatch('QUICKTASK_COORDS_CHANGED', {index, mx, my});
	}

	handleLocChange = (index, loc) => {
		this.props.dispatch('QUICKTASK_LOC_CHANGED', {index, loc});
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);