import React from 'react';
import {dict, icons} from '../../utils/Dictionary';
import Icon from '../../ui/Icon';
import classnames from 'classnames';

import './index.scss';

export default function MainMenu({active, onNavigate}) {
	let {menu} = icons;
	let keys = Object.keys(menu);
	return (
		<div className="x-task-main-menu" onClick={onNavigate}>
			{keys.map((name) => {
				return (
					<span className={classnames(active == name ? 'active' : '')} data-name={name} key={name}>
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