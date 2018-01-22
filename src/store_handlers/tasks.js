import StoreKeeper from '../utils/StoreKeeper';
import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
import {TASKS_STORAGE_KEY} from '../consts/storage';
 
const getDefaultState = () => {
  return {
    tasksFetching: false,
    taskInfoFetching: false,
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

const changed = (state, data) => {
  return data;
}

const shown = (state, {shownTaskId, shownTaskData, shownTaskIndex, prevNextButtons}) => {
  return {
    listChecked: [],
    shownTaskId,
    shownTaskData,
    shownTaskIndex,
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
  dispatch('TASKS_CHANGED', {tasksFetching: true});
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
  .then(data => {
    dispatch('TASKS_CHANGED', {tasksFetching: false, ...data});
  });
}

const show = ({dispatch, doAction, state}, data) => {
  let {tasks} = state;
  data.prevNextButtons = tasks.length > 1;
  data.shownTaskId = data.shownTaskData.id;
  doAction('TASKS_LOAD_TASK_INFO', data.shownTaskId);
  dispatch('TASKS_SHOWN', data);
  doAction('APP_SHOW_MODAL', {name: 'task_info'});
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
  dispatch('TASKS_CHANGED', {taskInfoFetching: true});
  get('load_task_info', {id})
  .then((info) => {
    let listChecked = info.listChecked;
    dispatch('TASKS_CHANGED', {taskInfoFetching: false, info, listChecked});
  });
}

const show_actions = ({dispatch}, id) => {
  dispatch('TASKS_CHANGED', {taskActionsData: {}});
  get('load_task_actions', {id})
  .then(data => {
    dispatch('TASKS_CHANGED', {taskActionsData: data});
  });
}

const action = ({doAction, state}, name) => {
  let {shownTaskData, taskActionsData: {task_id: id}} = state;
   get('task_action', {name, id})
  .then(data => {
    doAction('TASKS_LOAD');
    if (shownTaskData) {
      doAction('TASKS_LOAD_TASK_INFO', id);
    }
    doAction('TASKS_LOAD_COUNTS');
  });
}
 
const edit = ({doAction, state, getState}) => {
  let {taskActionsData: {task_id: id}, tasks} = state;
  for (let t of tasks) {
    if (t.id == id) {
      editTask(id, t.data.urls[0]);
    }
  }
}

const check_subtask = ({dispatch, state}, {idx, checked}) => {
  let {shownTaskId: id, listChecked = []} = state;
  if (checked) {
    listChecked.push(~~idx);
  } else {
    let index = listChecked.indexOf(~~idx);
    if (index > -1) {
      listChecked.splice(index, 1);
    }
  }
  dispatch('TASKS_CHANGED', {listChecked});
  post('check_subtask', {id, idx, checked});
}

const load_counts = ({dispatch}) => {
  get('load_task_counts')
  .then(({counts}) => {
    dispatch('TASKS_CHANGED', {counts});
  });
}

let interval;
const start_update = ({doAction}, data) => {
  doAction('TASKS_STOP_UPDATE');
  let cb = () => {
    doAction('TASKS_LOAD', data);
    doAction('TASKS_LOAD_COUNTS');  
  };    
  interval = setInterval(cb, 30000);
  cb();
}

const stop_update = () => {
  clearInterval(interval);
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
    edit,
    check_subtask,
    load_counts,
    start_update,
    stop_update
  },
  reducers: {
    init,
    reset,
    changed,
    shown,
    hidden
  }
} 