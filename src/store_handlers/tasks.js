import StoreKeeper from '../utils/StoreKeeper';
import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  tasks: [],
  tasksFetching: false,
  info: {}
}

const STORAGE_KEY = 'tasks_page';
let savedState = StoreKeeper.get(STORAGE_KEY);

let defaultState = {
  ...DEFAULT_STATE,
  ...savedState
};
let timeout;
const onStateChanged = (state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    StoreKeeper.set(STORAGE_KEY, {
      filter: state.filter,
      status: state.status,
      type: state.type,
      importance: state.importance
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

const shown = (state, {data, index, prevNextButtons}) => {
  return {
    shownTaskData: data,
    shownTaskIndex: index,
    prevNextButtons
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
  let {filter, status, importance, type} = state;
  if (data.importance) {
    if (data.importance == importance) {
      data.importance = '';
    }
    importance = data.importance;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.type) {
    if (data.type == type) {
       data.type = '';
    }
    type = data.type;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.filter) {
    filter = data.filter;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.status) {
    status = data.status;
    dispatch('TASKS_CHANGED', data);
  }
  let params = {
    importance,
    type,
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
  let {shownTaskIndex, tasks, prevNextButtons} = state;
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  dispatch('TASKS_SHOWN', {data: tasks[prev], index: prev, prevNextButtons});
}

const show_next = ({dispatch, state}) => {
  let {shownTaskIndex, tasks, prevNextButtons} = state;
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  dispatch('TASKS_SHOWN', {data: tasks[next], index: next, prevNextButtons});
}

const hide = ({dispatch}) => {
  dispatch('TASKS_HIDDEN');
}

const load_task_info = ({dispatch}, id) => {
  dispatch('TASKS_FETCHING');
  get('load_task_info', {id})
  .then((info) => {
    dispatch('TASKS_LOADED', {info});
  });
}

const show_actions = ({dispatch}, id) => {
  dispatch('TASKS_CHANGED', {taskActionsData: {}});
  get('load_task_actions', {id})
  .then((data) => {
    dispatch('TASKS_CHANGED', {taskActionsData: data});
  });
}

const action = ({doAction, state}, name) => {
  let {taskActionsData: {task_id: id}} = state;
   get('task_action', {name, id})
  .then((data) => {
    doAction('TASKS_LOAD');
  });
}
 
export default {
  onStateChanged,
  actions: {
    load,
    show,
    hide,
    show_prev,
    show_next,
    load_task_info,
    show_actions,
    action
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