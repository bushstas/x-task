import Fetcher from '../Fetcher';
import StoreKeeper from '../StoreKeeper';
import {LOCAL_STORAGE_DICTIONARY} from '../../consts';

export const dict = {};

let loaded = false;
const setDict = (d) => {
	loaded = true;
	for (let k in d) {
		dict[k] = d[k];
	}
};

class Dictionary {
	load() {
		let dataInStorage = StoreKeeper.getActual(LOCAL_STORAGE_DICTIONARY, '1hour');
		if (dataInStorage) {
			setDict(dataInStorage);
		} else {
			Fetcher.get('dictionary').then(this.onLoad);
		}
		return this;
	}

	then(cb) {
		if (loaded) {
			cb();
		} else {
			this.cb = cb;
		}
	}

	onLoad = (data) => {
		setDict(data.data);
		StoreKeeper.set(LOCAL_STORAGE_DICTIONARY, data.data);
	}

	get(key) {
		return dict[key] || 'NOT_IN_DICTIONARY';
	}
}

export default new Dictionary;
