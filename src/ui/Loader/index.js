import React from 'react';

export default function Loader({fetching, classes, className, height, children}) {
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