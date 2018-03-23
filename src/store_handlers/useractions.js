import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
import {USERACTIONS_STORAGE_KEY} from '../consts/storage';
 
const init = (state, userId = null) => {
  return {
    actions: null,
    dict: null,
    userId,
    tasks: null
  };
}

const load = ({then, setState, getState}, id) => {
  then('INIT', id);
  get('load_user_actions', {id})
  .then(({actions, dict}) => {
    setState({actions, dict});
  });
}

const action = ({state}, name) => {
  let {userId: id} = state;
  return get('user_action', {name, id});
}

const edit = ({state, doAction}) => {
  let {userId} = state;
  doAction('TEAM_SHOW_EDIT_FORM', userId);
}

const assign = ({doAction}) => {
  doAction('MODALS_SHOW', {name: 'user_tasks'});
}

const load_tasks = ({setState, state}) => {
  let {userId} = state;
  get('load_user_tasks', {userId}).then(setState);
}

const show_task_info = ({setState, doAction, state}, props) => {
  doAction('TASKINFO_CHANGE', props);
  doAction('MODALS_SHOW', {name: 'task_info', props});
}

const assign_task = ({setState, state}, id) => {
  let {userId} = state;
  post('assign_task', {id, userId})
    .then(() => {
        alert(11)
    });
}

 
export default {
  localStore: {
    key: USERACTIONS_STORAGE_KEY,
    names: ['userId']
  },
  actions: {
    load,
    action,
    edit,
    assign,
    load_tasks,
    show_task_info,
    assign_task
  },
  reducers: {
    init
  }
} 