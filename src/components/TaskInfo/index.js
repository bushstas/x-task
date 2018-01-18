import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import StoreKeeper from '../../utils/StoreKeeper';
import Icon from '../../ui/Icon';
import {Tabs, Tab} from '../../ui/Tabs';
import Avatar from '../Avatar';
import TaskComments from '../TaskComments';
import TaskProblems from '../TaskProblems';
import Store from 'xstore';
import {resolveTaskUrl} from '../../utils/TaskResolver';
import {parseText} from '../../utils/TextParser';

class TaskInfo extends React.Component {
	render() {
		let {data, info: {actions}} = this.props;
		let {data: d} = data;
		let href = resolveTaskUrl(d.urls);
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
			</div>
		)
	}

	get leftColumn() {
		let {data, info: {dict: dct = {}, status, comments, problems}} = this.props;
		let {data: d} = data;
		let {info} = d;
		let infoCount = Object.keys(info).length,
			commentsCount, problemsCount;
		if (comments) {
			commentsCount = comments.length;
			problemsCount = problems.length;
		}
		let titleClassName = $classy(data.importance, '.importance-', ['burning', 'urgent']);
		let statusClassName = $classy(status, '.status-', ['ready', 'in_work', 'delayed', 'frozen']);
		return (
			<td>
				<div class="status $statusClassName">
					<div class="left-side">
						{dct[status]}
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
				<Tabs>
					{this.renderTab(dict.information, infoCount, this.info)}
					{this.renderTab(dict.comments, commentsCount, this.comments)}
					{this.renderTab(dict.problems, problemsCount, this.problems)}
				</Tabs>
				
			</td>
		)
	}

	renderTab(caption, count, content) {
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
			<Tab caption={caption}>
				{content}
			</Tab>
		)
	}

	get info() {
		let {data, info: {dict}} = this.props;
		let {data: {info}} = data;
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

	handleActionsClick = () => {
		this.props.onActionsClick(this.props.data.id);
	}
}

let params = {
	has: 'tasks',
	flat: true
}
export default Store.connect(TaskInfo, params);