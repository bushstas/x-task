import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Store from 'xstore';

class TaskInfo extends React.Component {
	componentDidMount() {
		this.props.doAction('TASKS_LOAD_TASK_INFO', this.props.data.id);
	}

	render() {
		let {data} = this.props;
		let {data: d} = data;
		return (
			<div class="self">
				<div class="link">
					<Icon icon="open"/>
				</div>
				{this.buttons}
				<div class="content">
					<div class="participants">
						1111
					</div>
					<div class="title">
						{d.title}
					</div>
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

let params = {
	has: 'tasks',
	flat: true
}
export default Store.connect(TaskInfo, params);