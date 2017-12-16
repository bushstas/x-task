const {getOptions} = require('loader-utils');
const path = require('path');
const cssConsts = require(path.resolve(__dirname, '..', 'cssconsts');

const OPTIONS = {},
	  CLASSNAMES = '__classy',
	  DELIMITER = '-',
	  OBFUSCATED_LENGTH = 7,
	  MIN_OBFUSCATED_LENGTH = 3,
	  MAX_OBFUSCATED_LENGTH = 10,
	  ATTRIBUTE_NAME = 'class',
	  EXTRA_ATTRIBUTE_NAME = 'classes',
	  GLOBAL_PREFIX = '',
	  PREFIX_ATTR = 'prefix',
	  ADDED_PREFIX_ATTR = 'addedPrefix',
	  TAG_REGEX = /<[a-z][\w]*\s+[^>]+>/gi,
	  TAG_SPLIT_REGEX = /<[a-z][\w]*\s+[^>]+>/i,
	  CONDITIONS_REGEX = /\$\(([^\)]+)\)/g,
	  CONDITION_MARK = '_CONDITION_',
	  CSS_PREFIX_MATCH_REGEX = /\$*\.+[a-z_][\w\-]*/gi,
	  CSS_PREFIX_SPLIT_REGEX = /\$*\.+[a-z_][\w\-]*/i,
	  CSS_AUTO_PREFIX_REGEX = /\.with\.auto\.((added)*prefix)\./ig,
	  CSS_EXACT_AUTO_PREFIX_REGEX = /\.with\.auto\.prefix[;\s]/ig,
	  CLASSY_MAP_MATCH_REGEX = /\$classy\(\s*(\w+)\s*,\s*\{/g,
	  CLASSY_MAP_SPLIT_REGEX = /\$classy\(\s*\w+\s*,\s*\{/,
	  CLASSY_ARR_MAP_MATCH_REGEX = /\$classy\(\s*(\w+\s*,\s*["'][^'"]+["'])\s*,\s*\[/g,
	  CLASSY_ARR_MAP_SPLIT_REGEX = /\$classy\(\s*\w+\s*,\s*["'][^'"]+["']\s*,\s*\[/,
	  CLASSY_MATCH_REGEX = /\$classy\(\s*["']([^"']+)["']\s*\)/g,
	  CLASSY_SPLIT_REGEX = /\$classy\(\s*["'][^"']+["']\s*\)/,
	  CSS_URLS_REGEX = /url\([^\)]+\)/gi,
	  OBFUSCATED_URL_KEY = '_OBFUSCATED_URL_',
	  CSS_STRINGS1_REGEX = /'[^']+'/g,
	  OBFUSCATED_STRING1_KEY = '_OBFUSCATED_STRING1_',
	  CSS_STRINGS2_REGEX = /"[^"]+"/g,
	  OBFUSCATED_STRING2_KEY = '_OBFUSCATED_STRING2_',
	  CSS_SHORTCUTS_REGEX = /\bvar +\.([^\r\n\t;]+);*/gi,
	  CSS_SHORTCUTS_SPLIT_REGEX = /\bvar +\.[^\r\n\t;]+;*/i;

let loaderContext,
	obfuscationIndex = {},
	obfuscationMap = {},
	obfuscation,
	obfuscatedLength,
	obfuscatedContent,
	conditionIndex,
	conditions,
	delimiter,
	attributeName,
	extraAttributeName,
	globalPrefix,
	localPrfx,
	globalPrfx,
	varsUsed,
	parseMode = 'code',
	varsWereUsed,
	currentAttrName,
	prefixesParced,
	isExtraAttr,
	currentParser,
	currentSign,
	currentQuote,
	addCssPrefixAutomatically,
	autoPrefix,
	prefixAutoResolving,
	globalAutoPrefix,
	wasInited = {
		js: false,
		css: false
	};

const getParser = () => {
	let options = getOptions(loaderContext);
	if (typeof options.parser == 'string') {
		options.parser = options.parser.toLowerCase();
	}
	return options.parser == 'js' || options.parser == 'css' ? options.parser : 'js';
}

const init = (parser) => {
	wasInited[parser] = true;
	let options = {
		...OPTIONS,
		...getOptions(loaderContext)
	};
	let {
		attributeName:a = ATTRIBUTE_NAME,
		extraAttributeName: e = EXTRA_ATTRIBUTE_NAME,
		globalPrefix:g = GLOBAL_PREFIX,
		delimiter:d = DELIMITER,
		obfuscatedLength: l = OBFUSCATED_LENGTH,
		obfuscation: o = false,
		autoPrefixMode: ap,
		prefixAutoResolving: pr
	} = options;

	if (typeof l != 'number') {
		l = OBFUSCATED_LENGTH;
	} else {
		l = Math.max(MIN_OBFUSCATED_LENGTH, l);
		l = Math.min(MAX_OBFUSCATED_LENGTH, l);
	}

	attributeName = a;
	extraAttributeName = e;
	delimiter = d;
	globalPrefix = g;
	obfuscation = o;
	obfuscatedLength = l;
	globalAutoPrefix = ap;
	prefixAutoResolving = pr;
}

const getParts = (source) => {	
	let parts = source.split(getRegex());
	if (!parts[1]) {
		return;
	}
	return parts;
}

const getRegex = (quote = currentQuote) => {
	if (currentSign == ':') {
		return new RegExp('\\b' + currentAttrName + "\\s*:\\s*" + quote, 'g');	
	}
	return new RegExp('\\b' + currentAttrName + "\\s*=\\s*\\{*\\s*" + quote, 'g');
}

const getPrefixesRegex = (attr, glbl = '') => {
	if (glbl) {
		glbl = 'g';
	}
	return new RegExp('\\bwith(\\s+auto)*\\s+' + attr + '\\s+[\'"] *([a-z][a-z\\-0-9]*) *[\'"];*', glbl + 'i');
}

const getAttributeRegex = () => {
	return new RegExp('\\b' + currentAttrName + "\\s*" + currentSign + "\\s*[\"']");
}

const parsePrefixes = (source) => {
	if (!prefixesParced) {
		let prefixDefined = false;
		globalPrfx = localPrfx = globalPrefix;

		let matches = source.match(getPrefixesRegex(PREFIX_ATTR));
		if (matches) {
			if (!!matches[1]) {
				autoPrefix = true;
			}
			let lp = matches[2];
			if (lp) {
				localPrfx = lp;
				prefixDefined = true;
			}
		}

		matches = source.match(getPrefixesRegex(ADDED_PREFIX_ATTR));
		if (matches) {
			if (!!matches[1]) {
				autoPrefix = true;
			}
			let ap = matches[2];
			if (ap) {
				let d = delimiter;
				if (!localPrfx) {
					d = '';
				}
				localPrfx = localPrfx + d + ap;
				prefixDefined = true;
			}
		}
		if (!!prefixAutoResolving && !prefixDefined) {
			tryToGetPrefix(source);
		}
		prefixesParced = true;
		autoPrefix = globalAutoPrefix || autoPrefix;
	}
}

const tryToGetPrefix = (source) => {
	switch (prefixAutoResolving) {
		case 'folder':
			tryToGetPrefixFromFolderName();
		break;

		case 'file':
			tryToGetPrefixFromFileName();
		break;

		default:
			tryToGetPrefixFromContent(source);
	}
}

const tryToGetPrefixFromFolderName = () => {
	let r = loaderContext.resourcePath,
		parts = r.split(/\\|\//),
		l = parts.length,
		i = l - 2,
		folderName = parts[i];

	if (typeof folderName == 'string') {
		definePrefix(folderName);
	}
}

const tryToGetPrefixFromFileName = (source) => {
	let r = loaderContext.resourcePath,
		parts = r.split(/\\|\//),
		l = parts.length,
		i = l - 1,
		fileName = parts[i];

	if (typeof fileName == 'string') {
		definePrefix(fileName);
	}
}

const tryToGetPrefixFromContent = (source) => {
	let className;
	let matches = source.match(/\bexport +default +(class|function) +([a-zA-Z_][\w]*)/);
	if (matches && matches.length > 0) {
		className = matches[2];
	} else {
		matches = source.match(/\bexport +default +connect *\([^\)]*\)\( *([a-zA-Z_][\w]*) *\)/);
		if (matches && matches.length > 0) {
			className = matches[1];
		} else {
			matches = source.match(/\bclass +([a-zA-Z_][\w]*)/);
			if (matches && matches.length > 0) {
				className = matches[1];
			} else {
				matches = source.match(/\bfunction *([a-zA-Z_][\w]*) *\(/);
				if (matches && matches.length > 0) {
					className = matches[1];
				}
			}
		}
	}
	if (!!className && className.match(/^[A-Z]/)) {
		definePrefix(className);
	}
}

const definePrefix = (name) => {
	let d = delimiter, p;
	if (!localPrfx) {
		d = '';
	}	
	if (name.match(/_/)) {
		if (delimiter == '-') {
			name = name.replace('_', '-');
		}
		p = name;
	} else if (name.match(/-/)) {
		if (delimiter == '_') {
			name = name.replace('-', '_');	
		}
		p = name;
	} else {
		p = name.split(/(?=[A-Z])/).join(delimiter).toLowerCase();
	}
	localPrfx = localPrfx + d + p;	
}

const removePrefixes = (source) => {
	source = source.replace(getPrefixesRegex(PREFIX_ATTR, true), '');
	source = source.replace(getPrefixesRegex(ADDED_PREFIX_ATTR, true), '');
	return source;
}

const clean = (cl, count = 1) => {
	return cl.substring(count);
}

const getWithPrefix = (cl, prefix) => {
	if (cl == 'self') {
		return getWrappedWithQuotes(prefix);
	}
	return getWrappedWithQuotes(prefix, cl);
}

const getVariables = (cl) => {
	cl = clean(cl);
	if (cl.indexOf(CONDITION_MARK) === 0) {
		return getWithCondition(cl);
	}
	if (cl.indexOf('?') > -1) {
		let parts = cl.split('?');
		return getWithCondition('?' + parts[1], parts[0]);
	}
	return cl;
}

const getVariablesWithPrefix = (cl, prefix) => {
	cl = clean(cl);
	return getWrappedWithQuotes(prefix, '') + '+' + getVariables(cl);
}

const getWithCondition = (cl, cnd = null) => {
	cl = cl.replace(CONDITION_MARK, '').trim();
	cnd = cnd || getNextCondition();
	if (cl[0] == '?' && cnd) {
		let parts = clean(cl).split(':'),
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

const getWrappedWithQuotes = (cl, cl2 = null) => {
	let q = varsUsed ? '"' : '',
		d = !!cl ? delimiter : '';
	if (cl2 !== null) {
		cl = cl + d + cl2;	
	}	
	return q + (!obfuscation || cl2 === ''  ? cl : getObfuscatedClassName(cl)) + q;
}

const getPart = (cl) => {
	let c = cl[0],
		c2 = cl[1];
	switch (c) {
		case '.': {
			let p = !autoPrefix ? localPrfx : globalPrfx;
			cl = clean(cl);
			if (c2 == '.') {
				cl = clean(cl);
				if (autoPrefix) {
					return getWrappedWithQuotes(cl);
				}
				p = globalPrfx;
				c2 = cl[1];
			} else if (c2 == '$') {
				return getVariablesWithPrefix(cl, p);
			}
			return getWithPrefix(cl, p);
		}

		case '$':
			return getVariables(cl);
	}
	if (cl.indexOf('::') > -1) {
		return getWithGivenPrefix(cl);
	}
	if (autoPrefix) {
		return getWithPrefix(cl, localPrfx);
	}
	return getWrappedWithQuotes(cl);
}

const getWithGivenPrefix = (cl) => {
	let ps = cl.split('::');
	let d = delimiter;
	if (!globalPrefix) {
		d = '';
	}
	cl = globalPrefix + d + ps[0] + delimiter + ps[1];
	return getWrappedWithQuotes(cl);
}

const getAllMatches = (str, reg, idx = 0) => {
	let found, matches = [];
	while (found = reg.exec(str)) {
	    matches.push(found[idx]);
	    reg.lastIndex = found.index + found[0].length;
	}
	return matches;
}

const parse = (source) => {
	return parseWithQuote(parseWithQuote(source, '"'), "'");
}
 
const parseClassNames = (value) => {
	if (value) {
		conditionIndex = -1;
		conditions = getAllMatches(value, CONDITIONS_REGEX, 1);
		
		if (conditions.length > 0) {
			value = value.replace(CONDITIONS_REGEX, '$' + CONDITION_MARK);
		}

		value = value.replace(/(\w)([\.\$])/gi, "$1 $2")
				.replace(/\$\?(\.*)(\w+)/g, "$ $2?$1$2")
				.replace(/\$\s+/g, '$')
				.replace(/\s*\?\s*/g, '?')
				.replace(/\s*:\s*/g, ':')
				.replace(/\!\$/g, '$!');

		if (value) {
			if (varsUsed = conditions.length > 0 || (/\$/).test(value)) {
				varsWereUsed = true;
			}
			let classes = value.split(' ');
			let classNames = [];
			for (let cl of classes) {
				if (!!cl) {
					classNames.push(getPart(cl));
				}
			}

			let className;
			if (varsUsed) {
				className = CLASSNAMES + '(' + classNames.join(',');
			} else {
				className = classNames.join(' ');
			}
			if (varsUsed) {
				className += ')';
			}
			return className;
		}
	}
	return '';
}

const parseWithQuote = (source, quote) => {
	currentQuote = quote;
	let parts = getParts(source);
	if (parts instanceof Array) {	
		for (let i = 1; i < parts.length; i++) {
			let q = quote;
			let p = parts[i],			
				ps = p.split(q),
				value = ps[0];

			let className = parseClassNames(value);
			if (className) {
				ps[0] = '';
				if (currentSign != ':') {
					ps[1] = ps[1].trim();
					if (ps[1][0] == '}') {
						ps[1] = clean(ps[1]);
					}
				}
				ps = clean(ps.join(q));
				let q2 = q;
				if (varsUsed) {
					if (parseMode == 'tag') {
						q = '{';
						q2 = '}';
					} else {
						q = '';
						q2 = '';
					}
				}
				parts[i] = getRealAttributeName() + currentSign + q + className + q2 + ps;
			}
		}
		return parts.join('');
	}
	return source;
}

const getRealAttributeName = () => {
	return !isExtraAttr || !extraAttributeName ? 'className' : extraAttributeName;
}

const withImportClassMerger = (source) => {
	return "import " + CLASSNAMES + " from 'classy-loader/classy';" + source;
}

const generateClassName = () => {
	let len = obfuscatedLength - 1;
	let possible = 'abcdefghijklmnopqrstuvwxyz';
	let text = possible.charAt(Math.floor(Math.random() * possible.length));
	possible += '0123456789';	
	for (let i = 0; i < len; i++) {
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

const getObfuscatedClassName = (className) => {
	if (typeof obfuscationMap[className] == 'string') {
		return obfuscationMap[className];
	}
	let randomClassName;
	let count = 0;
	let maxCount = 99999;
	while (true) {
		randomClassName = generateClassName();
		if (!obfuscationIndex[randomClassName]) {
			break;
		}
		count++;
		if (count >= maxCount) {
			throw new Error('Obfuscation error: maximum count of class names reached. Impossible to generate new unique names');
			break;
		}
	}
	obfuscationIndex[randomClassName] = true;
	obfuscationMap[className] = randomClassName;
	return randomClassName;
}

const parseWithAttribute = (name, source) => {
	currentAttrName = name;
	if (!(getAttributeRegex()).test(source)) {
		return source;
	}
	parsePrefixes(source);
	let matches = getAllMatches(source, TAG_REGEX);
	if (matches.length == 0) {
		parseMode = 'code';		
		source = parse(source);
	} else {
		let parts = source.split(TAG_SPLIT_REGEX);
		source = '';
		let index = 0;
		for (let part of parts) {
			parseMode = 'code';
			part = parse(part);
			source += part;
			if (typeof matches[index] == 'string') {
				parseMode = 'tag';
				source += parse(matches[index]);
			}
			index++;
		}
	}
	return source;
}

const parseJsSource = (source) => {
	varsWereUsed = false;
	prefixesParced = false;
	isExtraAttr = false;
	autoPrefix = false;
	currentSign = '=';

	if (!wasInited[currentParser]) {
		init(currentParser);
	}
	source = parseWithAttribute(attributeName, source);
	
	if (!!extraAttributeName && typeof extraAttributeName == 'string') {
		isExtraAttr = true;
		source = parseWithAttribute(extraAttributeName, source);
		currentSign = ':';
		if (source.match(getRegex("'")) || source.match(getRegex('"'))) {
			source = parseWithAttribute(extraAttributeName, source);
		}
	}
	if (source.match(CLASSY_ARR_MAP_MATCH_REGEX)) {
		source = parseClassyArrMap(source);
	}
	if (source.match(CLASSY_MAP_MATCH_REGEX)) {
		source = parseClassyMaps(source);
	}
	if (source.match(CLASSY_MATCH_REGEX)) {
		source = parseClassy(source);
	}
	if (varsWereUsed) {
		source = withImportClassMerger(source);
	}
	return removePrefixes(source);
}

const parseClassyArrMap = (source) => {
	parsePrefixes(source);
	let matches = getAllMatches(source, CLASSY_ARR_MAP_MATCH_REGEX, 1);
	if (matches.length > 0) {
		let parts = source.split(CLASSY_ARR_MAP_SPLIT_REGEX);
		source = '';
		let index = 0, part;
		for (part of parts) {
			if (index > 0) {
				let v = matches[index - 1],
					vs = v.split(/\s*,\s*/),
					add = vs[1].replace(/['"]/g, ''),
					ps = part.split(']'),
					arr = ps[0].split(','),
					item, mapData = [];

				if (ps[1]) {
					ps[1] = clean(ps[1]);
					for (item of arr) {
						let item2 = item.replace(/['"]/g, '');
						if (!item.match(/\-/)) {
							item = item2;
						}
						let cl = parseClassNames(add + item2.trim());
						let q = !varsUsed ? '"' : '';
						mapData.push(item.trim() + ':' + q + cl + q);
					}
					ps[0] = '';
					let mapContent = '{' + mapData.join(',') + '}[' + vs[0] + ']';
					part = mapContent + clean(ps.join(']'));
				}
			}
			source += part;
			index++;
		}
	}
	return source;
}

const parseClassyMaps = (source) => {
	parsePrefixes(source);
	let matches = getAllMatches(source, CLASSY_MAP_MATCH_REGEX, 1);
	if (matches.length > 0) {
		let parts = source.split(CLASSY_MAP_SPLIT_REGEX);
		source = '';
		let index = 0, part;
		for (part of parts) {
			if (index > 0) {
				let v = matches[index - 1],
					ps = part.split('}'),
					map = ps[0].split(','),
					item;

				if (ps[1]) {
					ps[1] = clean(ps[1]);
					let mapData = [];
					for (item of map) {
						let p = item.split(':');
						if (p[1]) {
							let p0 = p[0].trim(),
								p1 = p[1].trim(),
								p2 = p1[0];
								p3 = p1[p1.length - 1];
							if ((p2 == '"' || p2 == "'") && (p3 == '"' || p3 == "'")) {
								let cl = parseClassNames(p1.replace(/['"]/g, ''));
								let q = !varsUsed ? '"' : '';
								mapData.push(p0 + ':' + q + cl + q);
							}
						} else {
							throw new Error('Incorrect code in classyMap context');
						}
					}
					let mapContent = '{' + mapData.join(',') + '}[' + v + ']';
					ps[0] = '';
					part = mapContent + clean(ps.join('}'));
				}
			}
			source += part;
			index++;
		}
	}
	return source;
}

const parseClassy = (source) => {
	parsePrefixes(source);
	let matches = getAllMatches(source, CLASSY_MATCH_REGEX, 1);
	if (matches.length > 0) {
		varsWereUsed = true;
		let parts = source.split(CLASSY_SPLIT_REGEX);
		source = '';
		let index = 0, part;
		for (part of parts) {
			source += part;
			if (typeof matches[index] == 'string') {
				let m = matches[index].replace(/['"]/g, '').trim();
				let cl = parseClassNames(m);
				if (varsUsed) {
					source += CLASSNAMES + '(' + cl + ')';	
				} else {
					source += '"' + cl + '"';	
				}				
			}
			index++;
		}
	}
	return source;
}





const getCssPrefixesRegex = (attr, glbl = '') => {
	if (glbl) {
		glbl = 'g';
	}
	return new RegExp('\\.with\\.' + attr + '\\.([a-z][a-z\\-0-9]*) *;*', glbl + 'i');
}

const parseCssPrefixes = (source) => {
	globalPrfx = localPrfx = globalPrefix;
	
	let matches = source.match(getCssPrefixesRegex(PREFIX_ATTR));
	if (matches) {
		let lp = matches[1];
		if (lp) {
			localPrfx = lp;
			autoPrefix = true;
		}
	}

	matches = source.match(getCssPrefixesRegex(ADDED_PREFIX_ATTR));
	if (matches) {
		let ap = matches[1];
		if (ap) {
			let d = delimiter;
			if (!localPrfx) {
				d = '';
			}
			localPrfx = localPrfx + d + ap;
			autoPrefix = true;
		}
	}

	autoPrefix = globalAutoPrefix || autoPrefix;
}

const getCssClassPrefix = (prefix, className) => {
	let d = delimiter;
	if (!prefix || !className) {
		d = '';
	}
	return prefix  + d;
}

const removeCssPrefixes = (source) => {
	source = source.replace(getCssPrefixesRegex(PREFIX_ATTR, true), '');
	source = source.replace(getCssPrefixesRegex(ADDED_PREFIX_ATTR, true), '');
	return source;
}

const parseCssClasses = (source) => {
	let matches = getAllMatches(source, CSS_PREFIX_MATCH_REGEX);
	if (matches.length > 0) {		
		let parts = source.split(CSS_PREFIX_SPLIT_REGEX);
		source = '';
		let index = 0;
		for (let part of parts) {
			source += part;
			if (typeof matches[index] == 'string') {
				let className, prefix;
				let m = matches[index];
				if (m.indexOf('...') === 0 && addCssPrefixAutomatically) {
					m = clean(m, 2);
				}
				if (m.indexOf('...') === 0) {
					m = clean(m, 3);
					if (m == 'self') {
						m = '';
					}
					className = getCssClassPrefix(globalPrfx, m) + m;
				} else if (m.indexOf('..') === 0) {
					m = clean(m, 2);
					if (m == 'self') {
						m = '';
					}
					prefix = addCssPrefixAutomatically ? globalPrfx : localPrfx;
					className = getCssClassPrefix(prefix, m) + m;
				} else {
					m = clean(m);
					if (addCssPrefixAutomatically && m == 'self') {
						m = '';
					}
			 		prefix = addCssPrefixAutomatically ? localPrfx : '';
					className = getCssClassPrefix(prefix, m) + m;
				}				
				if (obfuscation) {
					className = getObfuscatedClassName(className);
				}
				source += '.' + className;
			}
			index++;
		}
	}
	return source;
}

const parseCssSource = (source) => {
	obfuscatedContent = {};
	autoPrefix = false;
	if (!wasInited[currentParser]) {
		init(currentParser);
	}
	let s = source.replace(CSS_EXACT_AUTO_PREFIX_REGEX, '');
	if (addCssPrefixAutomatically = source != s) {
		source = s;
	}
	if (source.match(CSS_AUTO_PREFIX_REGEX)) {
		addCssPrefixAutomatically = true;
		source = source.replace(CSS_AUTO_PREFIX_REGEX, ".with.$1.");
	}
	if (source.match(CSS_SHORTCUTS_REGEX)) {
		source = parseCssShortcuts(source);
	}
	parseCssPrefixes(source);
	source = removeCssPrefixes(source);
	addCssPrefixAutomatically = addCssPrefixAutomatically || autoPrefix;
	if (addCssPrefixAutomatically || source.match(/\.{2,}[\w\-]+/i)) {
		source = obfuscateUrlsAndStrings(source);
		source = parseCssClasses(source);
		source = deobfuscate(source, OBFUSCATED_URL_KEY, 'urls');
		source = deobfuscate(source, OBFUSCATED_STRING1_KEY, 'strings1');
		source = deobfuscate(source, OBFUSCATED_STRING2_KEY, 'strings2');
	}
	return source;
}

const parseCssShortcuts = (source) => {
	let matches = getAllMatches(source, CSS_SHORTCUTS_REGEX, 1);
	if (matches.length > 0) {
		let parts = source.split(CSS_SHORTCUTS_SPLIT_REGEX);
		source = '';
		let index = 0;
		for (let part of parts) {
			source += part;
			if (typeof matches[index] == 'string') {
				let m = matches[index];
				let ps = m.split('.');
				for (let p of ps) {
					p = p.trim();
					let im = p.match(/\!/), v;
					if (im) {
						p =  p.replace(/\!/g, '');
					}
					if (typeof cssConsts[p] == 'string') {
						v = cssConsts[p];
					} else {
						let key = p.match(/^[a-z]+/i);
						let value = p.replace(/^[a-z]+/i, '');
						if (typeof cssConsts[key] == 'function') {							
							v = cssConsts[key](value);
						} else if (typeof cssConsts['_' + key] == 'function') {
							v =  cssConsts['_' + key](value);
						}
					}
					if (!!v) {
						if (im) {
							let pp = v.split(';');
							let vv = [];
							for (let pi of pp) {
								if (!!pi) {
									vv.push(pi + ' !important');
								}
							}
							v = vv.join(';') + ';';
						}
						source += v + "\n";
					} else {
						throw new Error('ClassyLoader css parsing error: unknown css shortcut "' + p + '"');
					}
				}
			}
			index++;
		}
	}
	return source;
}

const obfuscateUrlsAndStrings = (source) => {
	let matches = obfuscatedContent.urls = getAllMatches(source, CSS_URLS_REGEX);
	if (matches.length > 0) {
		source = source.split(CSS_URLS_REGEX).join(OBFUSCATED_URL_KEY);
	}
	matches = obfuscatedContent.strings1 = getAllMatches(source, CSS_STRINGS1_REGEX);
	if (matches.length > 0) {
		source = source.split(CSS_STRINGS1_REGEX).join(OBFUSCATED_STRING1_KEY);
	}
	matches = obfuscatedContent.strings2 = getAllMatches(source, CSS_STRINGS2_REGEX);
	if (matches.length > 0) {
		source = source.split(CSS_STRINGS2_REGEX).join(OBFUSCATED_STRING2_KEY);
	}
	return source;
}

const deobfuscate = (source, key, name) => {
	if (obfuscatedContent[name] instanceof Array) {
		let parts = source.split(key);
		source = '';
		let index = 0;
		for (let part of parts) {
			source += part;
			if (typeof obfuscatedContent[name][index] == 'string') {
				source += obfuscatedContent[name][index];
			}
			index++;
		}
	}
	return source;
}

function ClassyLoader(source) {
	loaderContext = this;
	currentParser = getParser();
	if (currentParser == 'js') {
		return parseJsSource(source);
	}
	if (currentParser == 'css') {
		return parseCssSource(source);
	}
	return source;
};

const con = (text, a = false) => {
	if (a) {
		console.log("\n\n========================");
	}
	console.log(text);
	if (a) {
		console.log("========================\n\n");
	}
}

ClassyLoader.init = (opts) => {
	if (opts instanceof Object) {
		for (let k in opts) {
			OPTIONS[k] = opts[k];
		}
	}
}

module.exports = ClassyLoader;