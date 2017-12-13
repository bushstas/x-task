import React from 'react';
import Icon from '../../ui/Icon';

import './index.scss';

export default function StartButton({onClick}) {
	return (
		<div class=".start-button" onClick={onClick}>
			<Icon icon="logo"/>
		</div>
	)
}