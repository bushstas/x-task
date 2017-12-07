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

const onLoad = (data) => {
	setDict(data.data);
	StoreKeeper.set(LOCAL_STORAGE_DICTIONARY, data.data);
	if (callback instanceof Function) {
		callback();
	}
}

export const load = () => {
	if (!loaded) {
		let dataInStorage = StoreKeeper.getActual(LOCAL_STORAGE_DICTIONARY, '1hour');
		if (dataInStorage) {
			setDict(dataInStorage);
		} else {
			get('dictionary').then(onLoad);
		}
	}
	return {then};
}