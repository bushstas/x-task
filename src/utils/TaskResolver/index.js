import Store from 'xstore';

let ROOTS = [],
	ROOT = '',
    TASK_URL,
    TASK_URL_PARTS = 0;

export const init = (roots) => {
	roots = roots.trim().replace(/[\r\n]+/g, ',').replace(/,{2,}/g, '').replace(/\s/g, '').split(',');
	if (!!roots[0]) {
		ROOTS = roots;
	}
	initUrls();
	window.addEventListener('popstate', handlePopState);
	window.addEventListener('hashchange', handlePopState);
}

export const initUrl = () => {
	let {pathname, host} = location;
		
	let pathParts = [
		host,
		...pathname.replace(/^\/+/, '').split('/')
	];

	for (let r of ROOTS) {
		if (r) {
			let ps = r.split('/');
			let f = [];
			for (let i = 0; i < ps.length; i++) {
				if (ps[i] == pathParts[i]) {
					f.push(ps[i]);
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
	for (let i = TASK_URL_PARTS; i < pathParts.length; i++) {
		url.push(pathParts[i]);
	}
	TASK_URL = url.join('/');
	TASK_URL += window.location.search;
	TASK_URL += window.location.hash;
}

const getMainUrl = () => {
	return ROOT + '/' + TASK_URL;
}

const initUrls = () => {
	initUrl();
	let state = Store.getState('quicktask');
	if (!state.urls[0] || state.urls[0] != getMainUrl()) {
		let urls = getUrls();
		Store.dispatch('QUICKTASK_PARAM_CHANGED', {urls});
	}
}

const handlePopState = () => {
	initUrls();
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

const isActive = (idx, parts) => {
	return idx >= TASK_URL_PARTS;
}
