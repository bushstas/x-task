import StoreKeeper from '../utils/StoreKeeper';
import {APP_STORAGE_KEY} from '../consts/storage';

const getSavedData = () => {
  return StoreKeeper.get(APP_STORAGE_KEY);
}

const getDefaultState = () => {
	return {
  		usersActiveTab: 'team',
  		appActiveTab: 'tasks',
  		accountActiveTab: 'home'
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
  
export default {
  onStateChanged,
  actions: {
  	change
  },
  reducers: {
    init,
    changed
  }
} 