import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import StoreKeeper from '../../utils/StoreKeeper';
import Icon from '../../ui/Icon';
import Checkbox from '../../ui/Checkbox';
import {Tabs, Tab} from '../../ui/Tabs';
import Loader from '../../ui/Loader';
import Avatar from '../Avatar';
import TaskComments from '../TaskComments';
import TaskProblems from '../TaskProblems';
import Store from 'xstore';
import {resolveTaskUrl} from '../../utils/TaskResolver';
import {parseText} from '../../utils/TextParser';

class TaskInfo extends React.Component {
	render() {
		console.log(this.props)
		let {shownTaskData, info: {actions}, taskInfoFetching} = this.props;
		let {data} = shownTaskData;
		let href = resolveTaskUrl(data.urls);
		return (
			<div class="self">
				{actions && (
					<a href={href} class="link" onMouseDown={this.handleLinkMouseDown}>
						<Icon icon="open"/>
					</a>
				)}
				{actions && (
					<div class="actions" onClick={this.handleActionsClick}>
						<Icon icon="settings"/>
					</div>
				)}
				{this.buttons}
				<div class="content">
					<table cellPadding="0" cellSpacing="0">
						<tbody>
							<tr>
								{this.leftColumn}
								{this.middleColumn}
								{this.rightColumn}
							</tr>
						</tbody>
					</table>
				</div>
				{taskInfoFetching && <Loader fetching={true}/>}
			</div>
		)
	}

	get leftColumn() {
		let {shownTaskData: data, info: {dict: dct = {}, status, comments, problems, task = {}}} = this.props;
		let {data: d} = data;
		let {scale, timeleft, timepassed} = task;
		let {info, taskList} = d;
		let infoCount = Object.keys(info).length,
			commentsCount, problemsCount;
		if (comments) {
			commentsCount = comments.length;
			problemsCount = problems.length;
		}
		let scaleClass = this.scaleClass;
		let titleClassName = $classy(data.importance, '.importance-', ['burning', 'urgent']);
		let statusClassName = $classy(status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);
		return (
			<td>
				<div class="status $statusClassName">
					<div class="left-side">
						{dct[status]}
						<div class="changed">
							{data.changed}
						</div>
					</div>
					<div class="right-side">
						<div class="importance">
							<Icon>
								{icons.task_imp[data.importance]}
							</Icon> 
							{dict[data.importance]}
						</div>
						<div class="type">
							<Icon>
								{icons.task_type[data.type]}
							</Icon> 
							{dict[data.type]}
						</div>
						<div class="action">
							<Icon>
								{icons.task_act[data.action]}
							</Icon> 
							{dict[data.action]}
						</div>
					</div>
				</div>
				<div class="title $titleClassName">
					{d.title}
				</div>
				<div class="description">
					{d.descr}
				</div>
				<div class="time $scale?with-scale $statusClassName">
					<Icon icon="time"/>
					{scale && (
						<div class="scale-outer">
							<div class="scale $scaleClass" style={{width: scale + '%'}}/>
						</div>
					)}
					<div class="timepassed">
						{timepassed}
					</div>
					<div class="timeleft">
						{timeleft}
					</div>

				</div>
				{taskList && this.subtasks}
				<Tabs value="information">
					{this.renderTab('information', infoCount, this.info)}
					{this.renderTab('comments', commentsCount, this.comments)}
					{this.renderTab('problems', problemsCount, this.problems)}
				</Tabs>
				
			</td>
		)
	}

	get scaleClass() {
		let {info: {task = {}}} = this.props;
		let {scale} = task;
		if (!scale) return;
		if (scale <= 30) {
			return $classy('scale-green');
		}
		if (scale <= 60) {
			return $classy('scale-yellow');
		}
		if (scale <= 80) {
			return $classy('scale-orange');
		}
		if (scale <= 95) {
			return $classy('scale-dark');
		}
		return $classy('scale-red');
	}

	get subtasks() {
		let {
			shownTaskData: {
				data: {taskList = []}
			}, 
			info: {
				dict = {},
				own,
				task = {}
			},
			listChecked = []
		} = this.props;
		if (taskList.length == 0) {
			return;
		}
		let {status} = task;
		return (
			<div class="subtasks">
				<div class="subtasks-title">
					<Icon icon="list"/>
					{dict.subtasks}
				</div>
				<div class="subtask-list">
					{taskList.map((item, i) => {
						let checked = listChecked.indexOf(i) > -1;
						let disabled = !own || status != 'in_work';
						return (
							<div class="subtask" key={i}>
								<Checkbox 
									disabled={disabled}
									checked={checked}
									value={i}
									onChange={this.handleSubtaskChecked}>
									{item}
								</Checkbox>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	renderTab(value, count, content) {
		let caption = dict[value];
		if (typeof count == 'number') {
			caption = (
				<span>
					{caption} &nbsp;{count}
					<span class=".tabs-count">
						{count}
					</span>
				</span>
			);
		}
		return (
			<Tab caption={caption} value={value}>
				{content}
			</Tab>
		)
	}

	get info() {
		let {shownTaskData, info: {dict}} = this.props;
		let {data: {info}} = shownTaskData;
		if (!dict) {
			return;
		}
		return (
			<div class="info">
				{Object.keys(info).map((k) => {
					return (
						<div class="info-block" key={k}>
							<div class="info-block-title">
								<Icon>
									{dict.icons[k]}
								</Icon>
								{dict.captions[k]}
							</div>
							<div class="info-block-content" dangerouslySetInnerHTML={{__html: parseText(info[k])}}/>
						</div>
					)
				})}
			</div>
		)
	}

	get comments() {
		return (
			<div class="comments">
				<TaskComments/>
			</div>
		)
	}

	get problems() {
		return (
			<div class="problems">
				<TaskProblems/>
			</div>
		)
	}

	get middleColumn() {
		return (
			<td>
				{this.history}
			</td>
		)
	}

	get rightColumn() {
		return (
			<td>
				{this.participants}
			</td>
		)
	}

	get history() {
		let {info: {dict, history: h}} = this.props;
		if (!dict) {
			return;
		}
		return (
			<div class="history">
				<div class="caption">
					{dict.history}
				</div>
				{h.map((action, i) => {
					return (
						<div class="action" key={i}>
							<Avatar
								id={action.avatar_id}
								userId={action.user_id}
								userName={action.user_name}
							/>
							<div class="action-name">
								{dict[action.action]}
							</div>
							<div class="action-time">
								{action.time}
							</div>
							<div class="action-ago">
								{action.ago}
							</div>
						</div>
					)
				})}
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
				{users.testers && (
					<div class="participant">
						<div class="caption">
							{dict.testers}
						</div>
						{users.testers.map((ex) => {
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
		let {prevNextButtons} = this.props;
		if (prevNextButtons) {
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

	handleLinkMouseDown = () => {
		let {shownTaskData: {id}} = this.props;
		StoreKeeper.set('current_viewed_task', id);
	}

	handleSubtaskChecked = (name, idx, checked) => {
		this.props.doAction('TASKS_CHECK_SUBTASK', {idx, checked: checked ? 1 : 0});
	}

	handleActionsClick = (id) => {
		this.props.doAction('TASKS_SHOW_ACTIONS', this.props.shownTaskData.id);
	}

	handlePrevClick = () => {
		this.props.doAction('TASKS_SHOW_PREV');
	}

	handleNextClick = () => {
		this.props.doAction('TASKS_SHOW_NEXT');	
	}
}

let params = {
	has: 'tasks',
	flat: true
}
export default Store.connect(TaskInfo, params);