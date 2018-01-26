import {get} from '../utils/Fetcher';

const init = () => {
  return {
    fetching: true
  };
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

const load = ({dispatch}) => {
  get('load_board')
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