import {get} from '../utils/Fetcher';
import {setProject} from '../utils/User';
import {BOARD_STORAGE_KEY} from '../consts/storage';

const init = () => {
  return {
      filter: 'status',
      addedUsers: {}
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

const load = ({then, setState, dispatchAsync, state}, filter) => {
  dispatchAsync('BOARD_CHANGED', {fetching: true});
  if (filter) {
    setState({filter});
  } else {
   filter = state.filter;
  }
  const {addedUsers} = state;
  const users = Object.keys(addedUsers).join(',');
  get('load_board', {filter, users})
  .then(boardData => {
    then('FETCHED', boardData);
  });
}

const add_user = ({setState, state, and}, {id, userId, userName}) => {
  const {addedUsers} = state;
  addedUsers[userId] = {avatarId: id, userName};
  setState({addedUsers});
  and('START_UPDATE');
}

const remove_user = ({setState, state, and}, userId) => {
  const {addedUsers} = state;
  delete addedUsers[userId];
  setState({addedUsers});
  and('START_UPDATE');
}

const reset_users = ({setState, and}) => {
  setState({addedUsers: {}});
  and('START_UPDATE');
}

const show_task_info = ({setState, doAction, state}, {id, index, status}) => {
  let tasksCount = state.tasks[status].length;
  setState({
    shownTaskId: id,
    shownTaskIndex: index,
    showTaskStatus: status
  });
  doAction('MODALS_SHOW', {name: 'task_info', props: {id, tasksCount, store: 'BOARD', index}});
}

const show_prev = ({and, state}) => {  
  let {shownTaskIndex, showTaskStatus, tasks} = state;
  tasks = tasks[showTaskStatus];
  let prev = shownTaskIndex - 1;
  if (prev < 0) {
    prev = tasks.length - 1;
  }
  and('SHOW_TASK_INFO', {id: tasks[prev].id, index: prev, status: showTaskStatus});
}

const show_next = ({and, state}) => {
  let {shownTaskIndex, showTaskStatus, tasks} = state;
  tasks = tasks[showTaskStatus];
  let next = shownTaskIndex + 1;
  if (next > tasks.length - 1) {
    next = 0;
  }
  and('SHOW_TASK_INFO', {id: tasks[next].id, index: next, status: showTaskStatus});
}

const load_on_project_set = ({and}) => {
  and('RESET_USERS');
  and('START_UPDATE');
}

let interval;
const start_update = ({and}, filter) => {
  and('STOP_UPDATE');
  and('LOAD', filter);
  interval = setInterval(() => {
    and('LOAD');
  }, 30000);
}

const stop_update = () => {
  clearInterval(interval);
}

export default {
  localStore: {
    key: BOARD_STORAGE_KEY,
    names: [
      'filter',
      'addedUsers'
    ],
    shouldSave: (state) => {
      return !!state
    }
  },
  actions: {
  	load,
    add_user,
    remove_user,
    reset_users,
    show_task_info,
    show_prev,
    show_next,
    load_on_project_set,
    start_update,
    stop_update
  },
  reducers: {
    init,
    fetched,
    changed
  }
} 