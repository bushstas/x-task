import React from 'react';
import Icon from '../../ui/Icon';

export default function StartButton({onClick}) {
	return (
		<div class="self" onClick={onClick}>
			<Icon icon="logo"/>
		</div>
	)
}