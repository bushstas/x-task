import React from 'react';

import './index.scss';

with addedPrefix 'loader';

export default function Loader({fetching, classes, height, children}) {
	return (
		<div class="$classes">
			{children}
			{fetching && (
				<div class="self">
					<div class="container">
						<div class="whirlpool"/>
					</div>
				</div>
			)}
		</div>
	)
}