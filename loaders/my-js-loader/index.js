var {getOptions} = require('loader-utils');

const CLASSNAMES = '_cn_';
const ATTR = 'xClassName';
const PREFIX_ATTR = 'xPrefix';
const ADDED_PREFIX_ATTR = 'xAddedPrefix';

const getParts = (source, attrName) => {
	let r = new RegExp(attrName + "\s*=\s*['\"]", 'g');
	let parts = source.split(r);
	if (!parts[1]) {
		return;
	}
	return parts;
}

const getPrefixes = (globalPrefix, prefixAttributeName, addedPrefixAttributeName, source, delimiter) => {
	let hasPrefix = false, hasAddedPrefix = false, matches, globalPrfx = globalPrefix, localPrfx = globalPrefix;
	matches = source.match(new RegExp(PREFIX_ATTR + '\s*=\s*[\'"]([a-z][a-z\-0-9]+)', 'gi'));
	if (matches && matches[0]) {
		localPrfx = matches[0].split(/['"]/)[1];
		hasPrefixes = true;
	}

	matches = source.match(new RegExp(ADDED_PREFIX_ATTR + '\s*=\s*[\'"]([a-z][a-z\-0-9]+)', 'gi'));
	if (matches && matches[0]) {
		let addedPrefix = matches[0].split(/['"]/)[1];
		localPrfx = localPrfx + delimiter + addedPrefix;
		hasPrefixes = true;
	}

	return {
		hasPrefix,
		hasAddedPrefix,
		localPrfx,
		globalPrfx
	};
}

const removePrefixes = (source, hasPrefix, hasAddedPrefix) => {console.log('=================================================666666666666666')
	if (hasPrefix) {
		source = source.replace(new RegExp(PREFIX_ATTR + '\s*=\s*[\'"][^\'"]+[\'"]', 'gi'), '');
	}
	if (hasAddedPrefix) {
		source = source.replace(new RegExp(ADDED_PREFIX_ATTR + '\s*=\s*[\'"][^\'"]+[\'"]', 'gi'), '');	
	}
	return source;
}

const withClassNamesImport = (source) => {
	return "import " + CLASSNAMES + " from 'classnames';" + source;
}

module.exports = function(source) {
	let {
		attributeName = ATTR,
		prefixAttributeName = PREFIX_ATTR,
		addedPrefixAttributeName = ADDED_PREFIX_ATTR,
		globalPrefix = '',
		delimiter = '-'
	} = options = getOptions(this) || {};

	let parts = getParts(source, attributeName);
	if (parts instanceof Array) {
		let varsUsed = false,
			varsWereUsed = false;
		let {localPrfx, globalPrfx, hasPrefix, hasAddedPrefix} = getPrefixes(
			globalPrefix,
			prefixAttributeName, 
			addedPrefixAttributeName,		
			source,
			delimiter
		);

		
		let q;
		for (let i = 1; i < parts.length; i++) {
			
			let p = parts[i],
				qi1 = p.indexOf('"'),
				qi2 = p.indexOf("'");

			if (qi2 == -1) {
				q = '"';
			} else if (qi1 == -1) {
				q = "'";
			} else if (qi1 >= 0 && qi1 < qi2) {
				q = '"';
			} else if (qi2 >= 0 && qi2 < qi1) {
				q = "'";
			}
			let ps = p.split(q);
			let value = ps[0];
			if (typeof value == 'string') {
				value = value.replace(/[^\w\-\.\$\?: ]/gi, '')
							 .replace(/(\w)([\.\$])/gi, "$1 $2")
							 .replace(/\.{2,}/g, '#')
							 .replace(/\s*\?\s*/g, '?')
							 .replace(/\s*:\s*/g, ':')
							 .replace(/\s{2,}/g, ' ');
			}
			if (value) {
				varsUsed = (/\$/).test(value);
				if (varsUsed) {
					varsWereUsed = true;
				}
				let quote = varsUsed ? '"' : '';
				let classes = value.split(' ');
				let classNames = [];
				for (let cl of classes) {
					if (cl[0] == '.') {
						cl = cl.substring(1);
						classNames.push(quote + localPrfx + delimiter + cl + quote);
					} else if (cl[0] == '#') {
						cl = cl.substring(1);
						classNames.push(quote + globalPrfx + delimiter + cl + quote);
					} else if (cl[0] == '$') {
						cl = cl.substring(1);
						classNames.push(cl);
					} else {
						classNames.push(quote + cl + quote);
					}
				}

				ps[0] = '';
				ps = ps.join(q).substring(1);

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
				parts[i] = ' className=' + q + className + q2 + ps;
			}
		}
		source = parts.join('');
		if (varsWereUsed) {
			source = withClassNamesImport(source);
		}
		source = removePrefixes(source, hasPrefix, hasAddedPrefix);
	}
	return source;
};