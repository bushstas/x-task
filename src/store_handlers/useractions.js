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
    load_tasks
  },
  reducers: {
    init
  }
} 