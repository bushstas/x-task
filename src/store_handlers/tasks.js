import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
import {TASKS_STORAGE_KEY} from '../consts/storage';
 
const init = () => {
  return {
    filter: 'all',
    fetching: false,
    taskInfoFetching: false
  }
}

const changed = (state, data) => {
  return data;
}

const load = ({dispatchAsync, setState, state}, data = {}) => {
  dispatchAsync('TASKS_CHANGED', {fetching: true});
  let {filter, status, importance = [], type = []} = state;
  if (data.importance) {
    let idx = importance.indexOf(data.importance);
    if (idx > -1) {
      importance.splice(idx, 1);
    } else {
      importance.push(data.importance);
    }
    setState({importance});
  }
  importance = importance.toString();
  if (data.type) {
    let idx = type.indexOf(data.type);
    if (idx > -1) {
      type.splice(idx, 1);
    } else {
      type.push(data.type);
    }
    setState({type});
  }
  type = type.toString();
  if (data.filter) {
    filter = data.filter;
    setState(data);
  }
  if (data.status) {
    status = data.status;
    setState(data);
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
    dispatchAsync('TASKS_CHANGED', {fetching: false});
    setState({
    	tasks,
    	dict
    });
  });
}

const load_on_project_set = ({and}) => {
  and('START_UPDATE');
}

const show_task_info = ({setState, doAction, state}, {id, index}) => {
  let tasksCount = state.tasks.length;
  setState({
  	shownTaskId: id,
    shownTaskIndex: index
  });
  doAction('MODALS_SHOW', {name: 'task_info', props: {id, tasksCount, store: 'TASKS', index}});
}

const show_prev = ({and, state}) => {  
  let {shownTaskIndex, tasks} = state;
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  and('SHOW_TASK_INFO', {id: tasks[prev].id, index: prev});
}

const show_next = ({and, state}) => {
  let {shownTaskIndex, tasks} = state;
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  and('SHOW_TASK_INFO', {id: tasks[next].id, index: next});
}

const load_counts = ({setState}) => {
  get('load_task_counts').then(setState);
}

let interval;
const start_update = ({and}, data) => {
  and('STOP_UPDATE');
  and('LOAD', data);
  and('LOAD_COUNTS');  
  interval = setInterval(() => {
    and('LOAD');
    and('LOAD_COUNTS');  
  }, 30000);
}

const stop_update = () => {
  clearInterval(interval);
}

export default {
  localStore: {
    key: TASKS_STORAGE_KEY,
    names: [
        'filter',
        'status',
        'type',
        'importance'
    ],
    timeout: 500
  },
  actions: {
    load,
    load_on_project_set,
    show_task_info,
    show_prev,
    show_next,
    load_counts,
    start_update,
    stop_update
  },
  reducers: {
    init,
    changed
  }
} 