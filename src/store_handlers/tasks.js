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

const shown = (state, {data, index}) => {
  return {
    shownTaskData: data,
    shownTaskIndex: index
  }
}

const hidden = () => {
  return {
    shownTaskData: null,
    shownTaskIndex: -1
  }
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

const show = ({dispatch, state}, data) => {
  let {tasks} = state;
  data.prevNextButtons = tasks.length > 1;
  dispatch('TASKS_SHOWN', data);
}

const show_prev = ({dispatch, state}) => {  
  let {shownTaskIndex, tasks} = state;
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  dispatch('TASKS_SHOWN', {data: tasks[prev], index: prev});
}

const show_next = ({dispatch, state}) => {
  let {shownTaskIndex, tasks} = state;
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  dispatch('TASKS_SHOWN', {data: tasks[next], index: next});
}

const hide = ({dispatch}) => {
  dispatch('TASKS_HIDDEN');
}
 
export default {
  onStateChanged,
  actions: {
    load,
    show,
    hide,
    show_prev,
    show_next
  },
  reducers: {
    init,
    fetching,
    loaded,
    changed,
    shown,
    hidden
  }
} 