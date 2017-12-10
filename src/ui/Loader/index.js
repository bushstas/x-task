import React from 'react';
import classnames from 'classnames';

import './index.scss';

export default function Loader({fetching, classes, height, children}) {
	return (
		<div className={classes}>
			{!fetching || fetching === '0' || fetching == 2 ? children : null}
			{fetching && (
				<div className="x-task-loader">
					<div className="cssload-container">
						<div className="cssload-whirlpool"/>
					</div>
				</div>
			)}
		</div>
	)
}