import React from 'react';
import {render} from 'react-dom';
import Store from 'xstore';

import App from './components/App';

import app from './store_handlers/app';
import statuses from './store_handlers/statuses';
import user from './store_handlers/user';
import board from './store_handlers/board';
import modals from './store_handlers/modals';
import mask from './store_handlers/mask';
import team from './store_handlers/team';
import projects from './store_handlers/projects';
import notifications from './store_handlers/notifications';
import quicktask from './store_handlers/quicktask';
import tooltip from './store_handlers/tooltip';
import tasks from './store_handlers/tasks';
import taskinfo from './store_handlers/taskinfo';
import taskactions from './store_handlers/taskactions';
import useractions from './store_handlers/useractions';
import quickcall from './store_handlers/quickcall';

Store.setDefaultParams({
	flat: true
});
Store.addHandlers({
	app,
	statuses,
	user,
	board,
	modals,
	mask,
	team,
	projects,
	notifications,
	quicktask,
	tooltip,
	tasks,
	taskinfo,
	taskactions,
	useractions,
	quickcall
});

const box = document.createElement('div');
box.className = $classy('.main-box');

Promise.all([
	Store.doAction('USER_LOAD'),
	Store.doAction('APP_LOAD_DICTIONARY')
])
.then(() => {
	document.body.appendChild(box);
	render(<App/>, box);
});
	
export const APP_MAIN_CONTAINER = box;