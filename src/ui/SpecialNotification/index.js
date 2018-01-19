import React from 'react';

export default function SpecialNotification({children}) {
	return (
		<div class="self">
			<div class="mask"/>
			<div class="content">
				{children}
			</div>	
		</div>
	)
}