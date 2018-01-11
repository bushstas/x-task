import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
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
					{this.participants}
					<div class="title">
						{d.title}
					</div>
				</div>
			</div>
		)
	}

	get participants() {
		let {info: {dict, users}} = this.props;
		if (!dict) {
			return;
		}
		return (
			<div class="participants">
				<div class="participant">
					<div class="caption">
						{dict.author}
					</div>
					<Avatar 
						classes="~large"
						id={users.author.id} 
						userName={users.author.name}/>
					<div class="name">
						{users.author.name}
					</div>
				</div>
				{users.executor && (
					<div class="participant">
						<div class="caption">
							{dict.executor}
						</div>
						<Avatar 
							classes="~large"
							id={users.executor.id} 
							userName={users.executor.name}/>
						<div class="name">
							{users.executor.name}
						</div>
					</div>
				)}
				{users.executors && (
					<div class="participant">
						<div class="caption">
							{dict.executors}
						</div>
						{users.executors.map((ex) => {
							return (
								<div>
									<Avatar 
										key={ex.id}
										classes="~large"
										id={ex.id} 
										userName={ex.name}/>
									<div class="name">
										{ex.name}
									</div>
								</div>
							)
						})}
					</div>
				)}
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