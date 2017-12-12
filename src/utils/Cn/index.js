let MAP = {};
let PREFIX = '';
let DELIMITER = '-';
let RESERVED = [
	'init'
];

const buildClassName = (classes, map, prfx) => {
	if (classes.length == 0) {
		return prfx;
	}	
	let classNames = [];
	for (let c of classes) {
		if (c instanceof Array) {
			classNames.push(
				buildClassName(c, map, prfx)
			);
		} else {
			if (typeof c == 'number') {
				c = map[c];
			}
			if (!!c && typeof c == 'string') {
				classNames.push(prfx + DELIMITER + c);
			}
		}
	}
	if (classNames.length > 0) {
		return classNames.join(' ');
	}
}

const Cn = (...classes) => {
	return buildClassName(classes, MAP, PREFIX);
}

Cn.init = (params) => {
	let {
		prefix,
		delimiter,
		map,
		maps
	} = params;

	if (prefix && typeof prefix == 'string') {
		PREFIX = prefix;
	}
	if (delimiter && typeof delimiter == 'string') {
		DELIMITER = delimiter;
	}
	if (map instanceof Object) {
		MAP = map;
	}
	if (maps instanceof Object) {
		let keys = Object.keys(maps);
		keys.forEach(function(key) {
			let {map = {}, prefix = ''} = maps[key];
			if (RESERVED.indexOf(key) == -1) {
				Cn[key] = (...classes) => {
					return buildClassName(classes, map, prefix);
				}
			}
		});
	}
}


export const cn = Cn;