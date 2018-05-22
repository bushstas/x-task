import {get, post} from '../utils/Fetcher';
 
const init = () => {
  return {
    data: {},
    fetching: false
  }
}

const fetching = (state) => {
  return {fetching: true}
}

const loaded = (state, data) => {
  data.fetching = false;
  return data;
}

const avatar_set = (state, id) => {
  const {data} = state;
  data.avatar_id = id;
  return {data};
}

const load = ({dispatchAsync, state}, userId) => {
  dispatchAsync('USERFORM_FETCHING');
  get('user_get_form', {userId})
  .then((data) => {
    dispatchAsync('USERFORM_LOADED', data);
  });
}

const handleUserSaved = (doAction) => {
  doAction('MODALS_HIDE', 'user_form');
  doAction('TEAM_REFRESH');
}

const create_user = ({state, doAction}) => {
    let {data} = state;
    post('user_create', data)
      .then(() => handleUserSaved(doAction));
}

const save_user = ({state, doAction}) => {
    let {data} = state;
    post('user_save', data)
      .then(() => handleUserSaved(doAction));
}

const show_avatars = ({setState, doAction}) => {
  doAction('MODALS_SHOW', {name: 'avatars', props: {store: 'USERFORM'}});
}

const set_avatar = ({then, doAction}, id) => {
  then('AVATAR_SET', id);
  doAction('MODALS_HIDE', 'avatars');
}

const change = ({setState}, data) => {
  setState(data);
} 

const dispose = ({then}) => {
  then('INIT');
}

export default {
  actions: {
    load,
    create_user,
    save_user,
    show_avatars,
    set_avatar,
    change,
    dispose
  },
  reducers: {
    init,
    fetching,
    loaded,
    avatar_set
  }
} 