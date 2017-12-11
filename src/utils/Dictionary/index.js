import {get} from '../Fetcher';
import StoreKeeper from '../StoreKeeper';
import {LOCAL_STORAGE_DICTIONARY} from '../../consts';

export const dict = {};
export const icons = {};

let loaded = false;
let callback;

const setDict = ({dict: d, icons: i}) => {
	loaded = true;
	let k;
	for (k in d) {
		dict[k] = d[k];
	}
	for (k in i) {
		icons[k] = i[k];
	}
}

const then = (cb) => {
	if (loaded) {
		cb();
	} else {
		callback = cb;
	}
}

const getKey = () => {
	let lang = window.XTaskLang ? window.XTaskLang + '_' : '';
	return lang + LOCAL_STORAGE_DICTIONARY;
}

const onLoad = (data) => {
	setDict(data);
	delete data.success;
	StoreKeeper.set(getKey(), data);
	if (callback instanceof Function) {
		callback();
	}
}

export const load = () => {
	if (!loaded) {
		let dataInStorage = StoreKeeper.getActual(getKey(), '1hour');
		if (dataInStorage) {
			setDict(dataInStorage);
		} else {
			get('dictionary', {lang: window.XTaskLang}).then(onLoad);
		}
	}
	return {then};
}