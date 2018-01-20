import Store from 'xstore';
import StoreKeeper from '../StoreKeeper';
import {EDITED_TASK_STORAGE_KEY, VIEWED_TASK_STORAGE_KEY, QUICKTASK_STORAGE_KEY} from '../../consts/storage';

let EDIT_TASK_PARAM = 'edit_x_task=',
	ROOTS = [],
	ROOT = '',
	OPTIONS,
    TASK_URL,
    TASK_URL_PARTS;

export const init = (data) => {
	parseGetParams();
	let {roots, nohashes, noparams, getparams} = data;
	if (typeof roots != 'string') {
		roots = '';
	}
	roots = roots.trim().replace(/[\r\n]+/g, ',').replace(/,{2,}/g, '').replace(/\s/g, '').split(',');
	if (!!roots[0]) {
		ROOTS = roots;
	}
	OPTIONS = {
		nohashes: nohashes == 1,
		noparams: noparams == 1,
		getparams
	}
	initUrls();
	let editedTask = StoreKeeper.get(EDITED_TASK_STORAGE_KEY);
	if (editedTask) {
		Store.doAction('QUICKTASK_LOAD_EDITED_TASK', editedTask);
		return;
	}
	let viewedTask = StoreKeeper.get(VIEWED_TASK_STORAGE_KEY);
	if (viewedTask) {
		
	}
}

const parseGetParams = () => {
	let {search, href} = location;
	if (search) {
		let parts = search.split(EDIT_TASK_PARAM);
		if (parts[1]) {
			let editedTaskId = parts[1].match(/^\d+/)[0] || '';
			if (editedTaskId) {
				StoreKeeper.set(EDITED_TASK_STORAGE_KEY, editedTaskId);
			}
			href = href.replace(EDIT_TASK_PARAM + editedTaskId, '');
			if (/\?$/.test(href)) {
				href = href.replace(/\?$/, '');
			}
			history.replaceState({}, '', href);
		}
	}
}

export const initUrl = (nohashes, noparams) => {
	TASK_URL_PARTS = 0;
	let {pathname, host, protocol} = location;
	ROOT = protocol + '//' + host;
		
	let pathParts = [
		host,
		...pathname.replace(/^\/+/, '').split('/')
	];

	for (let r of ROOTS) {
		if (r) {
			let ps = r.split('/');
			let f = [];
			for (let i = 0; i < ps.length; i++) {
				let p = ps[i];
				let pr = 'http';
				let parts = p.split('://');
				if (parts[1]) {
					pr = parts[0];
					p = parts[1];
				}
				if (i == 0) {
					if (/^\*\./.test(p)) {
						let ps2 = pathParts[i].split('.');
						if (ps2[2]) {
							let l = ps2.length;
							ps2 = ps2[l - 2] + '.' + ps2[l - 1];
							if (p == '*.' + ps2) {
								f.push(pr + '://' + p);
								continue;
							}
						}
					}
				} else if (p == '*') {
					f.push(pr + '://' + p);
					continue;
				}
				if (p == pathParts[i]) {
					f.push(pr + '://' + p);
				} else {
					break;
				}
			}
			if (f.length > TASK_URL_PARTS && f.length == ps.length) {
				TASK_URL_PARTS = f.length;
				ROOT = f.join('/');
			}
		}
	}
	let url = [];
	if (TASK_URL_PARTS == 0) {
		TASK_URL_PARTS = 1;
	}
	for (let i = TASK_URL_PARTS; i < pathParts.length; i++) {
		url.push(pathParts[i]);
	}
	TASK_URL = url.join('/');

	if (!noparams) {
		TASK_URL += window.location.search;
	}
	if (!nohashes) {
		TASK_URL += window.location.hash;
	}
}

const getMainUrl = () => {
	return ROOT + '/' + TASK_URL;
}

export const initUrls = ({nohashes, noparams} = {}) => {
	if (typeof nohashes == 'undefined') {
		nohashes = getNohashes();
	}
	if (typeof noparams == 'undefined') {
		noparams = getNoparams();
	}
	initUrl(nohashes, noparams);
	let state = Store.getState('quicktask');
	if (!state.urls || !state.urls[0] || state.urls[0] != getMainUrl() || state.nohashes != nohashes || state.noparams != noparams) {
		let urls = getUrls();
		Store.dispatch('QUICKTASK_PARAM_CHANGED', {urls, nohashes, noparams});
	}
}

const getNohashes = () => {
	let value = Store.getState('quicktask.nohashes');
	if (typeof value == 'undefined') {
		value = OPTIONS.nohashes;
	}
	return value;
}

const getNoparams = () => {
	let value = Store.getState('quicktask.noparams');
	if (typeof value == 'undefined') {
		value = OPTIONS.noparams;
	}
	return value;
}


const handlePopState = () => {
	initUrls();
}

export const getOption = (name) => {
	return OPTIONS[name];
}

export const getUrls = () => {
	if (!TASK_URL) {
		return {};
	}
	let main = getMainUrl();
	let urls = {
		'0': main
	}
	if (TASK_URL_PARTS > 0) {
		let idx = 0;
		for (let r of ROOTS) {
			let u = r + '/' + TASK_URL;
			if (u != main) {
				idx++;
				urls[idx] = u;
			}
		}
	}
	return urls;
}

export const hasHash = () => {
	return !!location.hash.replace(/\#/, '');
}

export const hasGetParams = () => {
	return !!location.search.replace(/\?/, '');
}

export const resolveTaskUrl = (urls) => {
	let {host} = location;

	let fisrtProtocol,
		firstUrl;
	for (let url of urls) {
		let ps = url.split('://');
		let protocol = 'http';
		if (ps[1]) {
			protocol = ps[0];
			url = ps[1];
		}
		ps = url.split('/');
		let urlHost = ps[0];
		if (urlHost == host) {
			return protocol + '://' + url;
		}
		if (!fisrtProtocol) {
			firstUrl = url;
			fisrtProtocol = protocol;
		}
	}
	return fisrtProtocol + '://' + firstUrl;
}

let fakeLink;
export const editTask = (id, url) => {
	if (!fakeLink) {
		if (!/^http/.test(url)) {
			url = 'http://' + url;
		}
		let gp = EDIT_TASK_PARAM + id;
		let parts = url.split('#');
		url = parts[0];
		if (!/\?/.test(url)) {
			url += '?' + gp; 
		} else {
			url += '&' + gp; 
		}
		if (typeof parts[1] == 'string') {
			url += '#' + parts[1];
		}
		fakeLink = document.createElement('a');
		fakeLink.setAttribute('href', url);
		document.body.appendChild(fakeLink);	
	}	
	fakeLink.click();
}

export const stopEditTask = () => {
	StoreKeeper.remove(EDITED_TASK_STORAGE_KEY);
}

window.addEventListener('popstate', handlePopState);
window.addEventListener('hashchange', handlePopState);