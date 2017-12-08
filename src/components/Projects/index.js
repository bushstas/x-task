import React from 'react';
import {dict} from '../../utils/Dictionary';
import Loader from '../../ui/Loader';
import Store from 'xstore';
import Table from '../../ui/Table';
import Icon from '../../ui/Icon';
import {hasRight} from '../../utils/User';

import './index.scss';

class Projects extends React.Component {

	componentDidMount() {
		this.props.doAction('PROJECTS_LOAD');
	}

	render() {
		let {fetching} = this.props;
	 	return (
	 		<Loader loaded={!fetching} classes="stretched">
				<div className="x-task-projects">
					{this.table}
				</div>
			</Loader>
		)
	}

	get table() {		
		return (
			<Table
				headers={this.headers}
				widths={this.widths}
				rows={this.rows}/>
		)
	}

	get headers() {
		const headers = [
			dict.open_tasks,
			dict.participants,
			dict.domains,
			dict.title			
		];
		if (hasRight('add_project')) {
			headers.push('');
		}
		headers.reverse();
		return headers;
	}

	get widths() {
		if (hasRight('add_project')) {
			return [2.5, 32.5, 29, 18, 18];
		}
		return [34, 30, 18, 18];
	}

	get rows() {
		let {projects} = this.props;
		const rows = [];
		let name, row;
		let index = 0;
		for (let p of projects) {
			row = [];
			if (hasRight('add_project')) {
				row.push(
					<Icon 
						classes="x-task-edit-icon" 
						data-index={index}
						onClick={this.handleEditProjectClick}>
						create
					</Icon>
				);
			}
			row.push(
				p.name,
				p.domain,
				p.users_count,
				''
			);
			rows.push(row);
			index++;
		}
		return rows;
	}

	handleEditProjectClick = () => {

	}	
}

const params = {
  has: 'projects',
  flat: true
}
export default Store.connect(Projects, params);