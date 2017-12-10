import React from 'react';
import classnames from 'classnames';
import {dict} from '../../utils/Dictionary';
import DraggableElement from '../../ui/DraggableElement';
import Icon from '../../ui/Icon';

import './index.scss';

export default class TaskMark extends React.Component {

	render() {
		let {data: {loc = 1}, onChangeCoords, index, classes} = this.props;
	 	return (
	 		<DraggableElement 
	 			classes={classnames('x-task-mark', classes, 'x-task-loc' + loc)}
	 			index={index}
	 			onChangeCoords={onChangeCoords}>
				<div onWheel={this.handleWheel}>
					<Icon>
						palette
					</Icon>
				</div>
			</DraggableElement>
		)
	}

	handleWheel = (e) => {
		e.preventDefault();
		let {deltaY} = e;
		let {data: {loc}, index} = this.props;
		if (!loc) {
			if (deltaY > 0) {
				loc = 2;
			} else {
				loc = 4;
			}
		} else {
			if (deltaY > 0) {
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
		}
		this.props.onLocChange(index, loc);
	}
}