import StoreKeeper from '../utils/StoreKeeper';
import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
import {TASKS_STORAGE_KEY} from '../consts/storage';
 
const getDefaultState = () => {
  return {
    filter: 'all',
    fetching: false,
    taskInfoFetching: false
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

 
const init = () => {
  return defaultState;
}

const reset = () => {
  return getDefaultState();
}

const changed = (state, data) => {
  return data;
}

const load = ({dispatch, state}, data = {}) => {
  dispatch('TASKS_CHANGED', {fetching: true});
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
  .then(({tasks, dict}) => {
    dispatch('TASKS_CHANGED', {
    	fetching: false,
    	tasks,
    	dict
    });
  });
}

const show_task_info = ({dispatch, doAction, state}, {id, index}) => {
  let tasksCount = state.tasks.length;
  dispatch('TASKS_CHANGED', {
  	shownTaskId: id,
    shownTaskIndex: index
  });
  doAction('MODALS_SHOW', {name: 'task_info', props: {id, tasksCount, store: 'TASKS'}});
}

const show_prev = ({doAction, state}) => {  
  let {shownTaskIndex, tasks} = state;
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  doAction('TASKS_SHOW_TASK_INFO', {id: tasks[prev].id, index: prev});
}

const show_next = ({doAction, state}) => {
  let {shownTaskIndex, tasks} = state;
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  doAction('TASKS_SHOW_TASK_INFO', {id: tasks[next].id, index: next});
}

const hide = ({dispatch, doAction}) => {
   dispatch('TASKS_CHANGED', {
  	shownTaskId: null,
    shownTaskIndex: null
  });
  doAction('MODALS_HIDE', 'task_info');
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
    show_task_info,
    hide,
    show_prev,
    show_next,
    load_counts,
    start_update,
    stop_update
  },
  reducers: {
    init,
    reset,
    changed
  }
} 