import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';

import './index.scss';

with addedPrefix 'main-menu';

export default function MainMenu({active, onNavigate}) {
	let {menu} = icons;
	let keys = Object.keys(menu);
	return (
		<div class=".self" onClick={onNavigate}>
			{keys.map((name) => {
				return (
					<span class="$active==name?..active" data-name={name} key={name}>
						{dict[name]}
						<div>
							<Icon size="16">
								{menu[name]}
							</Icon>
						</div>
					</span>
				)
			})}
		</div>
	)
}