import {get} from '../utils/Fetcher';
import StoreKeeper from '../utils/StoreKeeper';
import {setProject} from '../utils/User';
import {BOARD_STORAGE_KEY} from '../consts/storage';

const getSavedData = () => {
  return StoreKeeper.get(BOARD_STORAGE_KEY);
}

const getDefaultState = () => {
  return {
      filter: 'status',
      addedUsers: {}
  }
}
let defaultState = getSavedData() || getDefaultState();

const onStateChanged = (state) => {
    let {filter, addedUsers} = state;
    StoreKeeper.set(BOARD_STORAGE_KEY, {
      filter,
      addedUsers
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

const load = ({then, state}, filter) => {
  then('CHANGED', {fetching: true});
  if (filter) {
    then('CHANGED', {filter});
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

const add_user = ({then, state, and}, {id, userId, userName}) => {
  const {addedUsers} = state;
  addedUsers[userId] = {avatarId: id, userName};
  then('CHANGED', {addedUsers});
  and('LOAD');
}

const remove_user = ({then, state, and}, userId) => {
  const {addedUsers} = state;
  delete addedUsers[userId];
  then('CHANGED', {addedUsers});
  and('LOAD');
}

const reset_users = ({then, and}) => {
  then('CHANGED', {addedUsers: {}});
  and('LOAD');
}

const show_task_info = ({then, doAction, state}, {id, index, status}) => {
  let tasksCount = state.tasks[status].length;
  then('CHANGED', {
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
  and('LOAD');
}

export default {
  onStateChanged,
  actions: {
  	load,
    add_user,
    remove_user,
    reset_users,
    show_task_info,
    show_prev,
    show_next,
    load_on_project_set
  },
  reducers: {
    init,
    changed,
    fetched
  }
} 