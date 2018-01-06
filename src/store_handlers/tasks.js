import StoreKeeper from '../utils/StoreKeeper';
import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  tasks: [],
  tasksFetching: false 
}

const STORAGE_KEY = 'tasks_page';
let savedState = StoreKeeper.get(STORAGE_KEY);

let defaultState = savedState || DEFAULT_STATE;
let timeout;
const onStateChanged = (state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    StoreKeeper.set(STORAGE_KEY, {
      filter: state.filter,
      status: state.status
    });
  }, 500);
}

 
/**
 ===============
 Reducers
 ===============
*/
 
const init = () => {
  return defaultState;
}

const fetching = (state) => {
  return {tasksFetching: true}
}

const loaded = (state, data) => {
  return {
    ...data,
    tasksFetching: false
  }
}

const changed = (state, data) => {
  return data;
}

/**
 ===============
 Actions
 ===============
*/

const load = ({dispatch, state}, data = {}) => {
  dispatch('TASKS_FETCHING');
  let {filter, status} = state;
  if (data.filter) {
    filter = data.filter;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.status) {
    status = data.status;
    dispatch('TASKS_CHANGED', data);
  }
  let params = {
    filter,
    status
  };
  get('load_tasks', params)
  .then((data) => {
    dispatch('TASKS_LOADED', data);
  });
}
 
export default {
  onStateChanged,
  actions: {
    load
  },
  reducers: {
    init,
    fetching,
    loaded,
    changed
  }
} 