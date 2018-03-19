import React from 'react';
import Store from 'xstore';
import Dialog from '../../ui/Dialog';
import Loader from '../../ui/Loader';
import Task from '../Task';

class UserTasks extends React.Component {

	componentDidMount() {
		this.props.doAction('USERACTIONS_LOAD_TASKS');
	}

	render() {
		let {tasks} = this.props;
		return (
			<Loader classes="self" fetching={!tasks}>
				{tasks && tasks.map((task, i) => {
					return (
						<Task 
							data={task}
							key={task.id}
							index={i}
							onClick={this.handleTaskClick}/>
					)
				})}
			</Loader>
		)
	}

	handleTaskClick = () => {

	}
}

export default Store.connect(UserTasks, 'useractions');