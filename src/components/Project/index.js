import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import ActionsButton from '../ActionsButton';

export default class Project extends React.Component {	

	render() {
		let {data: {
			name,
			id, 
			actions
		}} = this.props;

		return (
			<div class="self" onClick={this.handleClick}>				
				<div class="main-info">
					<div class="name">
						{name}
					</div>
				</div>
				{actions && (
					<ActionsButton 
						id={id}
						loc="projects"
						name="project_actions"
					/>
				)}
			</div>
		)
	}

	handleClick = () => {

	}
}