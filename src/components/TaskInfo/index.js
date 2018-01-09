import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';

export default class TaskInfo extends React.Component {
	render() {
		let {data} = this.props;
		let {data: d} = data;
		return (
			<div class="self">
				<div class="link">
					<Icon icon="open"/>
				</div>
				{this.buttons}
				<div class="title">
					{d.title}
				</div>
			</div>
		)
	}

	get buttons() {
		let {buttons} = this.props;
		if (buttons) {
			return [
				<div class="prev" onClick={this.handlePrevClick} key="prev">
					<Icon icon="back"/>
				</div>,
				<div class="next" onClick={this.handleNextClick} key="next">
					<Icon icon="forward"/>
				</div>
			]
		}
	}

	handlePrevClick = () => {
		this.props.onPrev();
	}

	handleNextClick = () => {
		this.props.onNext();
	}
}