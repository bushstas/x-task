import {get} from '../Fetcher';
import StoreKeeper from '../StoreKeeper';
import {LOCAL_STORAGE_DICTIONARY} from '../../consts';

export const dict = {};

let loaded = false;
let callback;

const setDict = (d) => {
	loaded = true;
	for (let k in d) {
		dict[k] = d[k];
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
	setDict(data.data);
	StoreKeeper.set(getKey(), data.data);
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