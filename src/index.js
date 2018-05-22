import React from 'react';
import {render} from 'react-dom';
import Store from 'xstore';
import App from './components/App';

import {handlers} from './store_handlers';

Store.setDefaultParams({flat: true});
Store.addHandlers(handlers);

const box = document.createElement('div');
box.className = $classy('.main-box');
document.body.appendChild(box);

Promise.all([
	Store.doAction('USER_LOAD'),
	Store.doAction('APP_LOAD_DICTIONARY')
])
.then(() => render(<App/>, box));
	
export const APP_MAIN_CONTAINER = box;