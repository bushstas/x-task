let count = 0;
let loaded = 0;
let callback;

const isLoaded = () => {
	return loaded == count;
}

const onClassLoad = () => {
	loaded++;
	if (isLoaded() && callback instanceof Function) {
		callback();
	}
}

const then = (cb) => {
	if (isLoaded) {
		return cb();
	}
	callback = cb;
}

export const load = (...loads) => {
	count = loads.length;
	for (let load of loads) {
		load().then(onClassLoad);
	}
	return {then};
}
