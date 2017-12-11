import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';

import './index.scss';

class VisualElementPanel extends React.Component {

	render() {
		let {visualElement} = this.props;
		console.log(visualElement)
	 	if (!visualElement) {
	 		return null;
	 	}
	 	return (
	 		<div className="x-task-visual-element-panel">
				111111
			</div>
		)
	}
}

const params = {
  has: 'quicktask:visualElement',
  flat: true
}
export default Store.connect(VisualElementPanel, params);