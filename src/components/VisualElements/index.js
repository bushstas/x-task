import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';
import AreaSelection from '../../components/AreaSelection';

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
		let {visualElements, currentElement, bent} = this.props;
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
						if (!bent) {
							props.onLocChange = this.handleLocChange;
							return (
								<TaskMark {...props}/>
							)
						}
					break;

					case 'selection':
						if (bent) {
							let {markElement} = this.props;
							props.bent = true;
							props.markProps = visualElements[markElement];
							props.markProps.data.loc = 4;
						}
						return (
							<AreaSelection {...props}/>
						)
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