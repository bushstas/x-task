import {get, post} from '../utils/Fetcher';

const init = () => {
  return {
    statuses: null
  };
}

const changed = (state, data) => {
  return data;
}


const change = ({setState}, data) => {
  setState(data);
}

const load = ({dispatchAsync, setState}, id) => {
	dispatchAsync('STATUSES_CHANGED', {fetching: true});
	let data = null;
	if (id) {
		data = {id};
	}
  	get('load_work_status', data)
  		.then(data => {
  			setState(data);
  			dispatchAsync('STATUSES_CHANGED', {fetching: false});
  		});
}

const save = ({state, doAction}, data) => {
	if (state.userId) {
		data.userId = state.userId;
	}
  	post('save_work_status', data)
  		.then(() => {
  			doAction('TEAM_UPDATE');
  		});
}

const select_user = ({and, state}, userId) => {
	if (state.userId == userId) {
		userId = null;
	}
	and('LOAD', userId);
}

export default {
  actions: {
    change,
    load,
    save,
    select_user
  },
  reducers: {
  	init,
  	changed
  }
} 