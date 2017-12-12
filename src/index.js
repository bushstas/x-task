import React from 'react';
import {render} from 'react-dom';
import Store from 'xstore';

import App from './components/App';
import {load} from './utils/Loader';
import {load as dict} from './utils/Dictionary';
import {load as user} from './utils/User';

import userpage from './store_handlers/userpage';
import team from './store_handlers/team';
import projects from './store_handlers/projects';
import notifications from './store_handlers/notifications';
import quicktask from './store_handlers/quicktask';

import {cn} from './utils/Cn';
import cnParams from './cn';

cn.init(cnParams);

Store.addHandlers({
  userpage,
  team,
  projects,
  notifications,
  quicktask
});

let box = document.createElement('div');
box.className = cn(0);
document.body.appendChild(box);

load(dict, user).then(() => {
	render(		
		<App/>,
		box
	);
});