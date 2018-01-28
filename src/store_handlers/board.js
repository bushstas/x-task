import {get} from '../utils/Fetcher';
import StoreKeeper from '../utils/StoreKeeper';
import {BOARD_STORAGE_KEY} from '../consts/storage';

const getSavedData = () => {
  return StoreKeeper.get(BOARD_STORAGE_KEY);
}

const getDefaultState = () => {
  return {
      filter: 'status'
  }
}
let defaultState = getSavedData() || getDefaultState();

const onStateChanged = (state) => {
    let {filter} = state;
    StoreKeeper.set(BOARD_STORAGE_KEY, {
      filter
    });
}

const init = () => {
  defaultState.fetching = true;
  return defaultState;
}
 
const changed = (state, data) => {
  return data;
}

const fetched = (state, data) => {
  return {
    fetching: false,
    ...data
  };
}

const load = ({dispatch, state}, filter) => {
  if (filter) {
    dispatch('BOARD_CHANGED', {filter});
  } else {
   filter = state.filter;
  }
  get('load_board', {filter})
  .then(boardData => {
    dispatch('BOARD_FETCHED', boardData);
  });
}

const show_task_info = ({dispatch, doAction, state}, {id, index, status}) => {
  let tasksCount = state.tasks[status].length;
  dispatch('BOARD_CHANGED', {
    shownTaskId: id,
    shownTaskIndex: index,
    showTaskStatus: status
  });
  doAction('MODALS_SHOW', {name: 'task_info', props: {id, tasksCount, store: 'BOARD'}});
}

const show_prev = ({doAction, state}) => {  
  let {shownTaskIndex, showTaskStatus, tasks} = state;
  tasks = tasks[showTaskStatus];
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  doAction('BOARD_SHOW_TASK_INFO', {id: tasks[prev].id, index: prev, status: showTaskStatus});
}

const show_next = ({doAction, state}) => {
  let {shownTaskIndex, showTaskStatus, tasks} = state;
  tasks = tasks[showTaskStatus];
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  doAction('BOARD_SHOW_TASK_INFO', {id: tasks[next].id, index: next, status: showTaskStatus});
}


export default {
  onStateChanged,
  actions: {
  	load,
    show_task_info,
    show_prev,
    show_next
  },
  reducers: {
    init,
    changed,
    fetched
  }
} 