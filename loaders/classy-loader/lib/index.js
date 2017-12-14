var {getOptions} = require('loader-utils');

const CLASSNAMES = 'classy';
const DELIMITER = '-';
const ATTR = 'class';
const GLOBAL_PREFIX = '';
const PREFIX_ATTR = 'prefix';
const ADDED_PREFIX_ATTR = 'addedPrefix';

let conditionIndex,
	conditions,
	delimiter,
	attributeName,
	globalPrefix,
	hasPrefix,
	hasAddedPrefix,
	localPrfx,
	globalPrfx,
	varsUsed;


let wasInited = false;
const init = (_this) => {
	wasInited = true;
	let {
		attributeName:a = ATTR,
		globalPrefix:g = GLOBAL_PREFIX,
		delimiter:d = DELIMITER
	} = getOptions(_this) || {};

	attributeName = a;
	delimiter = d;
	globalPrefix = g;
}

const getParts = (source, quote) => {
	let r = new RegExp('\\b' + attributeName + "\\s*=\\s*" + quote, 'g');
	let parts = source.split(r);
	if (!parts[1]) {
		return;
	}
	return parts;
}

const getRegex = (attr) => {
	return new RegExp('\\bwith\\s+' + attr + '\\s+[\'"] *([a-z][a-z\\-0-9]*) *[\'"];*', 'i');
}

const parsePrefixes = (source) => {
	hasPrefix = false;
	hasAddedPrefix = false;
	globalPrfx = localPrfx = globalPrefix;

	let matches = source.match(getRegex(PREFIX_ATTR));
	if (matches) {
		let lp = matches[1];
		if (lp) {
			localPrfx = lp;
			hasPrefix = true;
		}
	}

	matches = source.match(getRegex(ADDED_PREFIX_ATTR));
	if (matches) {
		let ap = matches[1];
		if (ap) {
			localPrfx = localPrfx + delimiter + ap;
			hasAddedPrefix = true;
		}
	}
}

const removePrefixes = (source) => {
	if (hasPrefix) {
		source = source.replace(getRegex(PREFIX_ATTR), '');
	}
	if (hasAddedPrefix) {
		source = source.replace(getRegex(ADDED_PREFIX_ATTR), '');	
	}
	return source;
}

const clean = (cl, count = 1) => {
	return cl.substring(count);
}

const getWithPrefix = (cl, prefix) => {
	cl = clean(cl);
	if (cl == 'self') {
		return getQuotedWrapped(prefix);
	}
	return getQuotedWrapped(prefix, cl);
}

const getWithVariables = (cl) => {
	cl = clean(cl);
	if (cl.indexOf('_CONDITION_') === 0) {
		return getWithCondition(cl);
	}
	return cl;
}

const getWithCondition = (cl) => {
	cl = cl.replace(/^_CONDITION_/, '').trim();
	let cnd = getNextCondition();
	if (cl[0] == '?' && cnd) {
		let parts = clean(cl.split(':')),
			value = cnd + '?' + getPart(parts[0]) + ':';
		if (parts[1]) {
			value += getPart(parts[1]);
		} else {
			value += '""';
		}
		return value;
	}
}

const getNextCondition = () => {
	conditionIndex++;
	let c = conditions[conditionIndex];
	return typeof c == 'string' ? c : null;
}

const getQuotedWrapped = (cl, cl2 = '') => {
	let q = varsUsed ? '"' : '',
		d = !!cl ? delimiter : '';
	if (!cl2) {
		return q + cl + q;
	}	
	return q + cl + d + cl2 + q;
}


const getPart = (cl) => {
	let c = cl[0];	
	if (c == '.') {
		return getWithPrefix(cl, localPrfx);
	}
	if (c == '#') {
		return getWithPrefix(cl, globalPrfx);
	}
	if (c == '$') {
		return getWithVariables(cl);
	}
	
	return getQuotedWrapped(cl);
}

const parse = (source, quote) => {
	let parts = getParts(source, quote);
	if (parts instanceof Array) {
		let varsWereUsed;
		
		for (let i = 1; i < parts.length; i++) {
			let q = quote;
			let p = parts[i],			
				ps = p.split(q),
				value = ps[0];

			if (typeof value == 'string') {
				conditions = [];
				conditionIndex = -1;
				
				let found, reg = /\$\(([^\)]+)\)/g;
				while (found = reg.exec(value)) {
				    conditions.push(found[1]);
				    reg.lastIndex = found.index + found[0].length;
				}
				if (conditions.length > 0) {
					value = value.replace(reg, '$_CONDITION_');
				}

				value = value.replace(/(\w)([\.\$])/gi, "$1 $2")
							 .replace(/\.{2,}/g, '#')
							 .replace(/\s*\?\s*/g, '?')
							 .replace(/\s*:\s*/g, ':')
							 .replace(/\s{2,}/g, ' ');

				if (value) {
					if (varsUsed = conditions.length > 0 || (/\$/).test(value)) {
						varsWereUsed = true;
					}
					let classes = value.split(' ');
					let classNames = [];
					for (let cl of classes) {
						classNames.push(getPart(cl));						
					}

					ps[0] = '';
					ps = clean(ps.join(q));

					let className;
					if (varsUsed) {
						className = CLASSNAMES + '(' + classNames.join(',');
					} else {
						className = classNames.join(' ');
					}			

					let q2 = q;
					if (varsUsed) {
						className += ')';
						q = '{';
						q2 = '}';
					}
					parts[i] = 'className=' + q + className + q2 + ps;
				}
			}
		}
		source = parts.join('');
		if (varsWereUsed) {
			source = withClassNamesImport(source);
		}
	}
	return source;
}

const withClassNamesImport = (source) => {
	return "import " + CLASSNAMES + " from 'classy-loader/classy';" + source;
}

function ClassyLoader(source) {
	if (!wasInited) {
		init(this);
	}	
	parsePrefixes(source);	
	source = parse(source, '"');
	source = parse(source, "'");

	return removePrefixes(source);
};

module.exports = ClassyLoader;