import {PATH_TO_API, LOCAL_STORAGE_TOKEN} from '../../consts/storage';
import StoreKeeper from '../StoreKeeper';
import Store from 'xstore';
import {showSuccessNotification, showErrorNotification} from '../../components/Notifications';

class Fetcher {
	getPathToApi(action, data) {
		var token = StoreKeeper.get(LOCAL_STORAGE_TOKEN);
		var query = [];
		if (typeof XTaskLang != 'undefined') {
			var XTaskLang = 'ru';
		}
		if (typeof XTaskLang != 'string') {
			XTaskLang = 'ru';
		}
		query.push('lang=' + XTaskLang);
		if (token) {
			query.push('token=' + token);
		}
		if (action) {
			query.push('action=' + action);
		}
		if (data instanceof Object) {
			for (let k in data) {
				if (typeof data[k] == 'string' || 
					typeof data[k] == 'number' ||
					typeof data[k] == 'boolean') {
					query.push(k + '=' + data[k]);
				} else if (typeof data[k] == 'object') {
					query.push(k + '=' + JSON.stringify(data[k]));
				}
			}
		}
		query = query.join('&');
		return PATH_TO_API + (!!query ? '?' + query : '');
	}

	getFormData(data) {
		var formData = new FormData;
		if (data instanceof Object) {
			for (var k in data) {
				let a = data[k];
				if (a === undefined) continue;
				if (a instanceof Object) {
					a = JSON.stringify(data[k]);
				} else if (typeof a == 'boolean') {
					a = !!a ? 1 : 0;
				}
				formData.append(k, a);
			}
		}
		return formData;
	}

	get = (action, data) => {
		return this.send('GET', action, data);
	}

	post = (action, data) => {
		return this.send('POST', action, data);
	}

	send(method, action, data) {
		method = method || 'GET';
		let url, body, params = {method};
		if (method.toLowerCase() == 'get') {
			url = this.getPathToApi(action, data);
		} else {
			url = this.getPathToApi(action);
			params.body = this.getFormData(data);
		}
		return fetch(url, params)
		.then(response => response.json())
		.then(data => {
			let {success, message, body = {}, error} = data;
			if (success === true) {
		   		if (message) {
      				showSuccessNotification(message);
				}
		   		return body;
		    }
		    if (error) {
		    	throw new Error(error);
		    }
		    throw new Error('Неизвестная ошибка операции ' + action);
		})
		.catch(function({message}) {
			showErrorNotification(message);
		    return Promise.reject(message);
		});
	}
	
}

let fetcher = new Fetcher;
export const get = fetcher.get;
export const post = fetcher.post;