import {get, post} from '../Fetcher';
import StoreKeeper from '../StoreKeeper';
import Store from 'xstore';
import {init} from '../TaskResolver';
import {LOCAL_STORAGE_TOKEN} from '../../consts';
import {TASKS_STORAGE_KEY, QUICKTASK_STORAGE_KEY, APP_STORAGE_KEY} from '../../consts/storage';

let loaded = false,
	callback,
	currentProject = null,
	user = null,
	projects = [],
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
			init(user);
		}
		if (data.projects instanceof Array) {
			projects = data.projects;
		}
		if (data.rights instanceof Array) {
			rights = data.rights;
		}
	}
	if (callback instanceof Function) {
		callback(isAuthorized());
	}
}

const onFail = () => {
	StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
}


export const load = () => {
	if (!loaded) {
		var storedToken = StoreKeeper.get(LOCAL_STORAGE_TOKEN);
		if (storedToken) {
			get('load_user').then(onLoad, onFail);
		} else {
			loaded = true;
		}
	}
	return {then}
}

export const isAuthorized = () => {
	return !!user && user instanceof Object;
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

export const isCurrentProject = (token) => {
	return currentProject instanceof Object && token == currentProject.token;
}

export const inProject = (token) => {
	return isAdminLike() || projects.indexOf(token) > -1;
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
	if (!data.login) {
		data.login = '';
	}
	doAction('auth', data);
	return {then}
}

export const register = (data) => {
	if (!data.login) {
		data.login = '';
	}
	doAction('register', data);
	return {then}
}

export const logout = () => {
	post('logout');
	user = null;
	currentProject = null;
	StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
	StoreKeeper.remove(APP_STORAGE_KEY);
	StoreKeeper.remove(TASKS_STORAGE_KEY);
	StoreKeeper.remove(QUICKTASK_STORAGE_KEY);
	Store.reset();
	return {then}
}

export const getRole = () => {
	return user.role;
}

export const getRoleId = () => {
	return user.role_id;
}

export const getProjectName = () => {
	return user.project_name;
}

export const getProjectColor = () => {
	return user.project_color;
}

export const setProject = (id) => {
	return post('set_project', {id})
			.then(onLoad, onFail);
}