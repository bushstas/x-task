import {get, post} from '../Fetcher';
import StoreKeeper from '../StoreKeeper';
import {LOCAL_STORAGE_TOKEN} from '../../consts';

let loaded = false,
	callback,
	currentProject = null,
	user = null,
	rights = [];


const then = (cb) => {
	if (loaded) {
		cb(isAuthorized());
	} else {
		callback = cb;
	}
}

const onLoad = (data) => {
	loaded = true;
	if (data.errcode) {
		StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
	} else {
		if (data.project instanceof Object) {
			currentProject = data.project;
		}
		if (data.user instanceof Object) {
			user = data.user;
		}
		if (data.rights instanceof Array) {
			rights = data.rights;
		}
	}
	if (callback instanceof Function) {
		callback(isAuthorized());
	}
}


export const load = () => {
	if (!loaded) {
		var storedToken = StoreKeeper.get(LOCAL_STORAGE_TOKEN);
		if (storedToken) {
			get('load_user').then(onLoad);
		} else {
			loaded = true;
		}
	}
	return {then}
}

export const isAuthorized = () => {
	return user instanceof Object;
}

export const isCurrentUser = (u) => {
	const userToken = getToken();
	if (userToken) {
		if (typeof u == 'string') {
			return u == userToken;
		} else if (u instanceof Object && u.token) {
			return u.token == userToken;
		}
	}
}

export const getToken = () => {
	if (isAuthorized()) {
		return user.token;
	}
} 

export const hasRight = (code) => {
	return rights.indexOf(code) > -1;
}

export const isAdmin = () => {
	return isAuthorized() && user.role == 'admin';
}

export const isHead = () => {
	return isAuthorized() && user.role == 'head';
}

export const isAdminLike = () => {
	return isAdmin() || isHead();
}

export const getData = () => {
	return user;
}

export const getCurrentProject = () => {
	return currentProject;
}

export const inProject = (token) => {
	if (isAdminLike()) {
		return true;
	}
	let {projects} = user;
	if (projects instanceof Array) {
		return projects.indexOf(token) > -1;
	}
	return false;
}

const doAction = (action, data) => {
	loaded = false;
	let cb = function(data) {
		StoreKeeper.set(LOCAL_STORAGE_TOKEN, data.token);
		load();
	};
	post(action, data).then(cb);
}

export const auth = (data) => {
	doAction('auth', data);
	return {then}
}

export const register = (data) => {
	doAction('register', data);
	return {then}
}

export const logout = () => {
	post('logout');
	user = null;
	currentProject = null;
	StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
	return {then}
}

export default {
	isAuthorized,
	isCurrentUser,
	getToken,
	hasRight,
	isAdmin,
	isHead,
	isAdminLike,
	getData,
	getCurrentProject,
	inProject,
	auth,
	register,
	logout
}