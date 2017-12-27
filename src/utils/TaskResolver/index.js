let DOMAIN, 
	DOMAINS = [],
	EXCEPTS = [],
    ROOT,
    PATH_PARTS = [],
    HOST;

export const init = ({domain, root}) => {
	DOMAIN = domain;
	ROOT = root;

	let {pathname: p, host} = location;
	PATH_PARTS = p.replace(/^\/+/, '').split('/');
	HOST = host || 'localhost.ru';

	
	if (domain) {
		let domains = domain.split(';');
		for (let d of domains) {
			let ps = d.split('(');
			let subdomains = [];
			if (ps[1]) {
				let sd = ps[1].replace(/[\s\)]/g, '').split(',');
				for (let s of sd) {
					s = s.replace(/\s/g, '');
					if (s) {
						subdomains.push(s);
					}
				}
			}
			d = ps[0].replace(/\s/g, '');

			if (d) {
				let withMain = true,
					except = false;
				if (/^\^/.test(d)) {
					d = d.replace(/^\^/, '');
					except = true;
					if (!/^\*\./.test(d)) {
						withMain = false;
					}
				}
				if (subdomains.length > 0) {
					d = d.replace(/^\*\./, '');
				}
				if (withMain) {
					DOMAINS.push(d);
				}
				if (except) {
					EXCEPTS.push(d.replace(/^\*\./, ''));
				}
				for (let s of subdomains) {
					DOMAINS.push(s + '.' + d);
				}
			}
		}
	}
	console.log(DOMAINS)
	console.log(EXCEPTS)
}

export const getUrl = () => {
	

	switch (ROOT) {
		default:
			return '/' + PATH_PARTS.join('/');
	}
}

const isActive = (idx) => {
	return idx > 0;
}

export const getPathParts = () => {
	let parts = [
		HOST,
		...PATH_PARTS
	];
	let properParts = [];
	for (let i = 0; i < parts.length; i++) {
		properParts.push({
			value: parts[i],
			active: isActive(i)
		})
	}
	return properParts;
}

export const getUrls = (values) => {

}