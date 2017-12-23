import React from 'react';
import {render} from 'react-dom';
import Store from 'xstore';

import App from './components/App';
import {load} from './utils/Loader';
import {load as dict} from './utils/Dictionary';
import {load as user} from './utils/User';

import mask from './store_handlers/mask';
import userpage from './store_handlers/userpage';
import team from './store_handlers/team';
import projects from './store_handlers/projects';
import notifications from './store_handlers/notifications';
import quicktask from './store_handlers/quicktask';

Store.addHandlers({
	mask,
	userpage,
	team,
	projects,
	notifications,
	quicktask
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