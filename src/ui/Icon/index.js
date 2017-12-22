import React from 'react';
import classnames from 'classnames';
import {icons} from '../../utils/Dictionary';

export default function Icon({children, classes, size, icon, ...others}) {
	let style;
	if (size) {
		style = {
			fontSize: size + 'px'
		}
	}
	if (!children && icon) {
		children = icons[icon];
	}
	return (
		<i 
			class="self $classes"
			style={style}
			{...others}>
			{children}
		</i>
	)
}