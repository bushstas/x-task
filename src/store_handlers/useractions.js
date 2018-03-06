import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
 
const init = (state, userId = null) => {
  return {
    actions: null,
    dict: null,
    userId
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
 
export default {
  actions: {
    load,
    action,
    edit
  },
  reducers: {
    init
  }
} 