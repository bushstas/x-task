import Store from 'xstore';

let ROOTS = [],
	ROOT = '',
	OPTIONS,
    TASK_URL,
    TASK_URL_PARTS;

export const init = (data) => {
	let {roots, nohashes, noparams, getparams} = data;
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
}

export const initUrl = (nohashes, noparams) => {
	TASK_URL_PARTS = 0;
	let {pathname, host} = location;
	ROOT = host;
		
	let pathParts = [
		host,
		...pathname.replace(/^\/+/, '').split('/')
	];

	for (let r of ROOTS) {
		if (r) {
			let ps = r.split('/');
			let f = [];
			for (let i = 0; i < ps.length; i++) {
				if (i == 0) {
					if (/^\*\./.test(ps[i])) {
						let ps2 = pathParts[i].split('.');
						if (ps2[2]) {
							let l = ps2.length;
							ps2 = ps2[l - 2] + '.' + ps2[l - 1];
							if (ps[i] == '*.' + ps2) {
								f.push(ps[i]);
								continue;
							}
						}
					}
				} else if (ps[i] == '*') {
					f.push(ps[i]);
					continue;
				}
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

window.addEventListener('popstate', handlePopState);
window.addEventListener('hashchange', handlePopState);