import {PATH_TO_API, LOCAL_STORAGE_TOKEN} from '../../consts';
import StoreKeeper from '../StoreKeeper';
import Store from 'xstore';

class Fetcher {
	getPathToApi(action) {
		var path = PATH_TO_API;
		var token = StoreKeeper.get(LOCAL_STORAGE_TOKEN);
		var query = [];
		if (typeof XTaskLang == 'undefined') {
			var XTaskLang = 'ru';
		}
		if (typeof XTaskLang == 'string') {
			query.push('lang=' + XTaskLang);
		}
		if (token) {
			query.push('token=' + token);
		}
		if (action) {
			query.push('action=' + action);
		}
		query = query.join('&');
		return path + (!!query ? '?' + query : '');
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

	get(action, data) {
		return this.send('POST', action, data);
	}

	post(action, data) {
		return this.send('POST', action, data);
	}

	send(method, action, data) {
		var url = this.getPathToApi(action),
			formData = this.getFormData(data);

		return fetch(url, {
			method: method || 'GET',
			body: formData || new FormData
		})
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			if (data.success === true) {
		   		return data;
		    }
		    if (data.error) {
		    	throw new Error(data.error);
		    }
		    throw new Error('Неизвестная ошибка операции ' + action);
		})
		.catch(function({message}) {  
		    Store.doAction('NOTIFICATIONS_ADD', {message, showtime: 4000});
		    return Promise.reject(message);
		});
	}
	
}

let fetcher = new Fetcher;
export const get = fetcher.get.bind(fetcher);
export const post = fetcher.post.bind(fetcher);