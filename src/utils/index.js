import {APP_MAIN_CONTAINER} from '../index';

export const getScrollTop = () => {
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export const getElementMarginLeft = (x) => {	
	return x - Math.floor(document.body.clientWidth / 2);
}

export const getCenterCoords = () => {
	return {
		x: Math.floor(document.body.clientWidth / 2),
		y: Math.floor(document.body.clientHeight / 2) + getScrollTop()
	}
}

export const setScrollTop = (y) => {
	if (document.scrollingElement) {
		document.scrollingElement.scrollTop = y;
	} else if (document.documentElement) {	
		document.documentElement.scrollTop = y;
	}
}

export const getScrollHeight = () => {
	return Math.max(
	  document.body.scrollHeight, document.documentElement.scrollHeight,
	  document.body.offsetHeight, document.documentElement.offsetHeight,
	  document.body.clientHeight, document.documentElement.clientHeight
	);
}

export const getElementSelectorPath = (target) => {
	let chain = [];
	let add = (el) => {
		let tag = el.tagName;
		if (!!el.id && /^[\w\-]+$/.test(el.id.trim())) {
			tag += '#' + el.id.trim();
		}
		if (!!el.className && /^[\w\- ]+$/.test(el.className.trim())) {
			tag += '.' + el.className.trim().replace(/ {2,}/g, ' ').split(' ').join('.');
		}
		let p = el.parentNode;
		let ns = p.childNodes;
		let count = 1;
		for (let i = 0; i < ns.length; i++) {
			let n = ns[i];
			if (n instanceof Element) {
				if (n == el) {
					tag += ':nth-child(' + count + ')';
					break;
				}
				count++;
			}
		}
		chain.unshift(tag);
	}
	add(target);
	let parent = target.parentNode;
	while (parent instanceof Element) {
		add(parent);
		parent = parent.parentNode;
		if (parent == APP_MAIN_CONTAINER) {
			return '';
		}
		if (parent == document.body) {
			break;
		}
	}

	return chain.join(' ');
}

export const generateKey = () => {
	let len = 10;
	let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let text = '';
	for (let i = 0; i < len; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}