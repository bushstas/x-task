import StoreKeeper from '../utils/StoreKeeper';
import {APP_STORAGE_KEY} from '../consts/storage';
import {get, post} from '../utils/Fetcher';

const getSavedData = () => {
  return StoreKeeper.get(APP_STORAGE_KEY);
}

const getDefaultState = () => {
	return {
  		usersActiveTab: 'team',
  		appActiveTab: 'tasks',
  		accountActiveTab: 'home',
      quicktaskMode: false
	}
}
let defaultState = getSavedData() || getDefaultState();

const onStateChanged = (state) => {
    StoreKeeper.set(APP_STORAGE_KEY, state);
}

const init = () => {
  return defaultState;
}
 
const changed = (state, data) => {
  if (data.quicktaskMode) {
    data.active = false;
  } else if (data.active) {
    data.quicktaskMode = false;
  }
  return data;
}

const change = ({dispatch}, data) => {
  dispatch('APP_CHANGED', data);
}

const show_status = ({dispatch}, data) => {
  get('load_work_status')
  .then(data => {
    dispatch('APP_CHANGED', data);
  });
}

const save_status = ({dispatch}, data) => {
  post('save_work_status', data)
  .then(() => {
    
  });
}

export default {
  onStateChanged,
  actions: {
  	change,
    show_status,
    save_status
  },
  reducers: {
    init,
    changed
  }
} 