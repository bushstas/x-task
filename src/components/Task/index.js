import React from 'react';

import './index.scss';

export default function Task({data}) {
	return (
		<div class="self">
			{data.title}
		</div>
	)
}