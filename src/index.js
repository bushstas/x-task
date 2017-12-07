import React from 'react';
import {render} from 'react-dom';

import App from './components/App';
import {load} from './utils/Loader';
import {load as dict} from './utils/Dictionary';
import {load as user} from './utils/User';

load(dict, user).then(() => {
	let box = document.createElement('div');
	box.className = 'x-task-main-box';
	document.body.appendChild(box);
	render(<App/>, box);
});
