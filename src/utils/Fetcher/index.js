import {PATH_TO_API, LOCAL_STORAGE_TOKEN} from '../../consts';
import StoreKeeper from '../StoreKeeper';

class Fetcher {
	getPathToApi(action) {
		var path = PATH_TO_API;
		var token = StoreKeeper.get(LOCAL_STORAGE_TOKEN);
		var query = [];
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
				formData.append(k, data[k] instanceof Object ? JSON.stringify(data[k]) : data[k]);
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
		    } else if (data.error) {
		    	alert(data.error);
		    	if (data.errcode) {
		    		return data;
		    	}
		    } else {
		    	alert('Неизвестная ошибка операции ' + action);
		    }
		 return data;
		})
		.catch(function(err) {  
		    alert(err);
		});
	}
	
}

let fetcher = new Fetcher;
export const get = fetcher.get.bind(fetcher);
export const post = fetcher.post.bind(fetcher);