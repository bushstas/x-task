import React from 'react';
import VisualElement from '../VisualElement';
import TaskMark from '../TaskMark';
import {handleWheel} from '../../utils/MouseHandlers';

const TYPE = 'selection';

export default class AreaSelection extends React.Component {

	render() {
		let {
			bent,
			markProps,
			taskType,
			taskImportance
		} = this.props;
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			ref="element"
	 			classes="self"
	 			type={TYPE}
	 			onWheel={this.handleWheel}>
	 			{bent && (
	 				<TaskMark 
	 					taskType={taskType}
	 					taskImportance={taskImportance}
	 					{...markProps}/>
	 			)}
	 		</VisualElement>

		)
	}

	handleWheel = (e) => {
		this.props.onChange(
			handleWheel(e, TYPE, this.props.data)
		);
	}
}