import React from 'react';
import { render, } from 'react-dom';

import App from './components/App';
import Dict from './utils/Dictionary';

Dict.load().then(() => {
	let box = document.createElement('div');
	box.className = 'x-task-main-box';
	document.body.appendChild(box);

	render(<App/>, box);
});
