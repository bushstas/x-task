import React from 'react';
import Store from 'xstore';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import Releases from '../Releases';

class ReleasesList extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD_RELEASES');
	}

	render() {
		let {releasesList} = this.props;
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClose}/>
				<Loader classes="content" fetching={!releasesList}>
					<Releases 
						items={releasesList}
						onSelect={this.handleSelect}
					/>
				</Loader>
			</div>
		)
	}

	handleSelect = (id) => {
		this.props.doAction(this.props.store + '_LOAD_ON_RELEASE_SET', id);
		this.handleClose();
	}

	handleClose = () => {
		this.props.doAction('MODALS_HIDE', 'releases_list');
		this.props.doAction('PROJECTS_RESET_LIST');
	}
}

export default Store.connect(ReleasesList, 'projects');