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
      shown: null
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

const show_board = ({dispatch}) => {
  dispatch('APP_CHANGED', {shown: 'board'});
  get('load_board')
  .then((boardData) => {
    dispatch('APP_CHANGED', boardData);
  });
}

export default {
  onStateChanged,
  actions: {
  	change,
    show_status,
    save_status,
    show_board
  },
  reducers: {
    init,
    changed
  }
} 