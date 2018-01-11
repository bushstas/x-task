import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import StoreKeeper from '../../utils/StoreKeeper';
import Icon from '../../ui/Icon';
import Avatar from '../Avatar';
import Store from 'xstore';
import {resolveTaskUrl} from '../../utils/TaskResolver';

class TaskInfo extends React.Component {
	componentDidMount() {
		this.props.doAction('TASKS_LOAD_TASK_INFO', this.props.data.id);
	}

	render() {
		let {data} = this.props;
		let {data: d} = data;
		let href = resolveTaskUrl(d.urls);
		return (
			<div class="self">
				<a href={href} class="link" onMouseDown={this.handleLinkMouseDown}>
					<Icon icon="open"/>
				</a>
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
						id={users.author.avatar_id}
						userId={users.author.id}
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
							id={users.executor.avatar_id}
							userId={users.executor.id}
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
								<div key={ex.id}>
									<Avatar 
										classes="~large"
										id={ex.avatar_id}
										userId={ex.id} 
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

	handleLinkMouseDown = () => {
		let {data: {id}} = this.props;
		StoreKeeper.set('current_viewed_task', id);
	}
}

let params = {
	has: 'tasks',
	flat: true
}
export default Store.connect(TaskInfo, params);