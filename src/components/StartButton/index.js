import React from 'react';
import Icon from '../../ui/Icon';
import {cn} from '../../utils/Cn';

import './index.scss';

export default function StartButton({onClick}) {
	return (
		<div className={cn(1)} onClick={onClick}>
			<Icon icon="logo"/>
		</div>
	)
}