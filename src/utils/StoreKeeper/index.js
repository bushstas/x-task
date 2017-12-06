const KEY = 'x_task_stored_';
const PERIODS	= {
	month: 2592000, 
	day: 86400,
	hour: 3600,
	min: 60
};

class StoreKeeper {
	set(k, v) {
		let lk = g(k),
			i = JSON.stringify({'data': v, 'timestamp': Date.now().toString()});
			localStorage.setItem(lk, i);
	}

	get(k) {
		let i = gi(k);
		if (i instanceof Object && i.data) {
			return i.data;
		}
		return null;
	}

	getActual(k, p) {
		let i = gi(k);
		if (i instanceof Object && !!i.data && ia(i.timestamp, p)) {
			return i.data;
		}
		return null;
	}
	remove(k) {
		let lk = g(k);
		localStorage.removeItem(lk)
	}
}

function g(k) {
	return KEY + k
}

function gm(p) {
	let n = ~~p.replace(/[^\d]/g, ''),
		m = p.replace(/\d/g, '');
	if (!n || !PERIODS[m]) {
		return 0;
	}
	return PERIODS[m] * n * 1000;
}

function gi(k) {
	let lk = g(k),
		i = localStorage.getItem(lk);
	if (!i) {
		return null;
	}
	try {
		i = JSON.parse(i);
	} catch (e) {
		return null;
	}
	return i;
}

function ia(sm, p) {
	let nm = Date.now(),
		pm = gm(p);
		if (typeof sm == 'string') {
			sm = Number(sm);
		}
		return !!pm && !!sm && nm - sm < pm;
}

export default new StoreKeeper;