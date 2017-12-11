import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  users: [],
  userFormShown: null,
  userFormData: {},
  editedUserToken: null,
  teamFetching: false 
}
 
/**
 ===============
 Reducers
 ===============
*/
 
const init = () => {
  return DEFAULT_STATE;
}

const fetching = (state) => {
  return {teamFetching: true}
}

const loaded = (state, data) => {
  return {
    ...data,
    teamFetching: false
  }
}

const form_data_changed = (state, userFormData) => {
  return {userFormData}
}

const edit_form_shown = (state, {user, userToken}) => {
  return {
    editedUserToken: userToken,
    userFormShown: 'edit',
    userFormData: user
  }
}

const add_form_shown = (state) => {
  return {userFormShown: 'add'}
}

const canceled = (state) => {
   return {
    editedUserToken: null,
    userFormShown: null,
    userFormData: {}
  }
}

const changed = (state, users) => {
   return {
    users,
    editedUserToken: null,
    userFormShown: null,
    userFormData: {},
    teamFetching: false
  }
}
 
/**
 ===============
 Actions
 ===============
*/

const load = ({dispatch}) => {
  dispatch('TEAM_FETCHING');
  get('load_users')
  .then((data) => {
    dispatch('TEAM_LOADED', data);
  });
}

const save = ({dispatch, state, doAction}, {token}) => {
    let {userFormData} = state;
    post('save_user', {userToken: token, ...userFormData})
    .then(
        () => doAction('TEAM_REFRESH')
    );
}

const refresh = ({dispatch, state}) => {
    dispatch('TEAM_FETCHING');
    get('refresh_users')
    .then(({users}) => {
        dispatch('TEAM_CHANGED', users);
     });
}

const show_edit_form = ({dispatch}, userToken) => {
  post('get_user_data', {userToken})
    .then(({user}) => {
      dispatch('TEAM_EDIT_FORM_SHOWN', {userToken, user});
    });   
}
 
 
export default {
  actions: {
    load,
    save,
    refresh,
    show_edit_form
  },
  reducers: {
    init,
    fetching,
    loaded,
    form_data_changed,
    add_form_shown,
    edit_form_shown,
    canceled,
    changed
  }
} 