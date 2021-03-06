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
  get('user_get_actions', {id})
  .then(({actions, dict}) => {
    setState({actions, dict});
  });
}

const action = ({state}, name) => {
  let {userId: id} = state;
  return post('user_do_action', {name, id});
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
  get('user_get_tasks', {userId}).then(setState);
}

const show_task_info = ({doAction}, props) => {
  doAction('TASKINFO_CHANGE', props);
  doAction('MODALS_SHOW', {name: 'task_info', props});
}

const assign_task = ({state}, id) => {
  let {userId} = state;
  post('task_assign', {id, userId})
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