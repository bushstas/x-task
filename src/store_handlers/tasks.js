import StoreKeeper from '../utils/StoreKeeper';
import {resolveTaskUrl, editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
import {TASKS_STORAGE_KEY} from '../consts/storage';
 

const getDefaultState = () => {
  return {
    tasksFetching: false,
    info: {}
  }
}
let savedState = StoreKeeper.get(TASKS_STORAGE_KEY);

let defaultState = {
  ...getDefaultState(),
  ...savedState
};
let timeout;
const onStateChanged = (state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    StoreKeeper.set(TASKS_STORAGE_KEY, {
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

const reset = () => {
  return getDefaultState();
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
  let {filter, status, importance = [], type = []} = state;
  if (data.importance) {
    let idx = importance.indexOf(data.importance);
    if (idx > -1) {
      importance.splice(idx, 1);
    } else {
      importance.push(data.importance);
    }
    dispatch('TASKS_CHANGED', {importance});
  }
  importance = importance.toString();
  if (data.type) {
    let idx = type.indexOf(data.type);
    if (idx > -1) {
      type.splice(idx, 1);
    } else {
      type.push(data.type);
    }
    dispatch('TASKS_CHANGED', {type});
  }
  type = type.toString();
  if (data.filter) {
    filter = data.filter;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.status) {
    status = data.status;
    dispatch('TASKS_CHANGED', data);
  }
  if (data.my) {
    filter = 'my';
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

const show = ({dispatch, doAction, state}, data) => {
  let {tasks} = state;
  data.prevNextButtons = tasks.length > 1;
  doAction('TASKS_LOAD_TASK_INFO', data.data.id);
  dispatch('TASKS_SHOWN', data);
}

const show_prev = ({doAction, state}) => {  
  let {shownTaskIndex, tasks, prevNextButtons} = state;
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  doAction('TASKS_SHOW', {data: tasks[prev], index: prev});
}

const show_next = ({doAction, state}) => {
  let {shownTaskIndex, tasks, prevNextButtons} = state;
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  doAction('TASKS_SHOW', {data: tasks[next], index: next});
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
  let {shownTaskData, taskActionsData: {task_id: id}} = state;
   get('task_action', {name, id})
  .then((data) => {
    doAction('TASKS_LOAD');
    if (shownTaskData) {
      doAction('TASKS_LOAD_TASK_INFO', id);
    }
  });
}
 
const edit = ({doAction, state, getState}) => {
  let {taskActionsData: {task_id: id}, tasks} = state;
  for (let t of tasks) {
    if (t.id == id) {
      let url = resolveTaskUrl(t.data.urls);
      editTask(id, url);
    }
  }
  
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
    action,
    edit
  },
  reducers: {
    init,
    reset,
    fetching,
    loaded,
    changed,
    shown,
    hidden
  }
} 