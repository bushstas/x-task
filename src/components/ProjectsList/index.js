import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import {addHandler, removeHandler} from '../../utils/EscapeHandler';

class ProjectsList extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD_LIST');
		addHandler(this.handleClose);
	}

	componentWillUnmount() {
		removeHandler(this.handleClose);
	}

	render() {
		let {projectsList} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
				<Loader classes="content" fetching={!projectsList}>
					{this.buttons}
				</Loader>
			</div>
		)
	}

	get buttons() {
		let {projectsList, dict} = this.props;
		return (
			<div class="actions">
				{projectsList && projectsList.map((project) => {
					let {name, id, current} = project;
					return (
						<Button 
							key={id}
							value={id}
							onClick={this.handleClick}
							disabled={current}>
							{name}
						</Button>
					)
				})}
			</div>
		)
	}

	handleClick = (id) => {
		this.props.doAction('USER_SET_PROJECT', id)
		.then(() => {
			this.props.doAction(this.props.store + '_LOAD_ON_PROJECT_SET');
		});
		this.handleClose();
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'projects_list');
		this.props.doAction('PROJECTS_RESET_LIST');
	}
}

let params = {
	has: 'projects',
	flat: true
}
export default Store.connect(ProjectsList, params);