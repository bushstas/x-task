import React from 'react';
import {render} from 'react-dom';
import Store from 'xstore';

import App from './components/App';
import {load} from './utils/Loader';
import {load as dict} from './utils/Dictionary';
import {load as user} from './utils/User';

import app from './store_handlers/app';
import mask from './store_handlers/mask';
import team from './store_handlers/team';
import projects from './store_handlers/projects';
import notifications from './store_handlers/notifications';
import quicktask from './store_handlers/quicktask';
import tooltip from './store_handlers/tooltip';
import tasks from './store_handlers/tasks';
import taskinfo from './store_handlers/taskinfo';

Store.addHandlers({
	app,
	mask,
	team,
	projects,
	notifications,
	quicktask,
	tooltip,
	tasks,
	taskinfo
});

let box = document.createElement('div');
box.className = $classy('.main-box');
document.body.appendChild(box);

load(dict, user).then(() => {
	render(		
		<App/>,
		box
	);
});

export const APP_MAIN_CONTAINER = box;