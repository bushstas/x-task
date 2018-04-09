import React from 'react';
import Store from 'xstore';
import {dict} from '../../utils/Dictionary';

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

		return (
			<div class="self" style={bgStyle}>
				<div class="project-info-inner">
					<div class="project-name" style={bgStyle} onClick={this.handleProjectClick}>
						{name}
					</div>
					{release.name ? 
						<div class="project-release">
							<div class="project-release-name">
								{dict.release}: {release.name}
							</div>
							<div class="project-release-date">
								{dict.planned} {release.date}
							</div>
						</div> : null
					}
					{progress.all ? 
						<div class="project-stat">
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
}

export default Store.connect(ProjectInfo, 'user:project');