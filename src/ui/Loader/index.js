import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Loader({loaded, classes, height, children}) {
	if (loaded) {
		return children;
	}
	return (
		<div className={classnames('x-task-loader', classes)}>
			<div className="cssload-container">
				<div className="cssload-whirlpool"/>
			</div>
		</div>
	)
}