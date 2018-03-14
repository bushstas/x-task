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

const load = ({then, setState, dispatchAsync, state, getState}, filter) => {
  dispatchAsync('BOARD_CHANGED', {fetching: true});
  if (filter) {
    setState({filter});
  } else {
   filter = state.filter;
  }
  const isMine = filter == 'mine';
  if (isMine) {
    filter = 'status';
  }
  const {addedUsers} = state;
  let users = Object.keys(addedUsers).join(',');
  if (isMine) {
    const user = getState('user.user');
    users = user.id;
  }
  get('load_board', {filter, users})
  .then(boardData => {
    dispatchAsync('BOARD_CHANGED', {fetching: false});
    setState(boardData);
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
  const props = {
    id, tasksCount, store: 'BOARD', index
  }
  doAction('TASKINFO_CHANGE', props);
  doAction('MODALS_SHOW', {name: 'task_info', props});
}

const show_prev = ({and, state}) => {  
  let {shownTaskIndex, showTaskStatus: status, tasks} = state;
  tasks = tasks[status];
  let index = shownTaskIndex - 1;
  if (index < 0) {
    index = tasks.length - 1;
  }
  const id = tasks[index].id;
  and('SHOW_TASK_INFO', {id, index, status});
}

const show_next = ({and, state}) => {
  let {shownTaskIndex, showTaskStatus: status, tasks} = state;
  tasks = tasks[status];
  let index = shownTaskIndex + 1;
  if (index > tasks.length - 1) {
    index = 0;
  }
  const id = tasks[index].id;
  and('SHOW_TASK_INFO', {id, index, status});
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
      'addedUsers',
      'shownTaskId',
      'shownTaskIndex',
      'showTaskStatus'
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