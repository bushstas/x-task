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
  		accountActiveTab: 'home'
	}
}
let defaultState = getSavedData() || getDefaultState();

const onStateChanged = (state) => {
    let {
      appActiveTab,
      usersActiveTab,
      accountActiveTab,
      shown
    } = state;
    StoreKeeper.set(APP_STORAGE_KEY, {
      appActiveTab,
      usersActiveTab,
      accountActiveTab,
      shown
    });
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
  post('save_work_status', data);
}

const show_board = ({dispatch}) => {
  dispatch('APP_CHANGED', {shown: 'board'});
  get('load_board')
  .then(boardData => {
    dispatch('APP_CHANGED', boardData);
  });
}

const show_modal = ({dispatch, state}, {name, props = {}}) => {
  let {shownModals = {}} = state;
  shownModals[name] = props;
  dispatch('APP_CHANGED', {shownModals});
}

const hide_modal = ({dispatch, state}, name) => {
  let {shownModals = {}} = state;
  delete shownModals[name];
  dispatch('APP_CHANGED', {shownModals});
}

export default {
  onStateChanged,
  actions: {
  	change,
    show_status,
    save_status,
    show_board,
    show_modal,
    hide_modal
  },
  reducers: {
    init,
    changed
  }
} 