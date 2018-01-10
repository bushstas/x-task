import React from 'react';
import {AVATAR_PATH} from '../../consts/avatar';

export default function Avatar({id, userName}) {
	let style = {
		backgroundImage: 'url(' + AVATAR_PATH + id + '.jpg)'
	}
	return (
		<div class="self" title={userName}>
			<div class="inner" style={style}/>
		</div>
	)
}