import React from 'react';
import {AVATAR_PATH} from '../../consts/avatar';

export default function Avatar({id}) {
	let style = {
		backgroundImage: 'url(' + AVATAR_PATH + id + '.jpg)'
	}
	return (
		<div class="self">
			<div class="inner" style={style}/>
		</div>
	)
}