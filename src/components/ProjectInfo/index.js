import React from 'react';
import Store from 'xstore';
import Icon from '../../ui/Icon';
import {dict, icons} from '../../utils/Dictionary';

class ProjectInfo extends React.Component {
	render() {
		const {
			project: {
				bgStyle,
				name,
				release
			}, 
			progress = {}
		} = this.props;
		const {active} = release;

		return (
			<div class="self !$active?inactive">
				<div class="bg" style={bgStyle}/>
				<div class="inner">
					<div class="name" style={bgStyle} onClick={this.handleProjectClick}>
						{name}
					</div>
					{release.name ? 
						<div class="release" onClick={this.handleReleaseClick}>
							<div class="release-name">
								{!active && <Icon icon="checked"/>}
								{dict.release}: {release.name}
							</div>
							<div class="release-date">
								{dict.planned} {release.date}
							</div>
						</div> : null
					}
					{progress.all ? 
						<div class="stat">
							{dict.tasks_complete}: {progress.done} / {progress.all}
						</div> : null
					}
				</div>
			</div>
		)
	}

	handleProjectClick = () => {
		const {store} = this.props;
		this.props.doAction('MODALS_SHOW', {name: 'projects_list', props: {store}});
	}

	handleReleaseClick = () => {
		const {store} = this.props;
		this.props.doAction('MODALS_SHOW', {name: 'releases_list', props: {store}});
	}
}

export default Store.connect(ProjectInfo, 'user:project');