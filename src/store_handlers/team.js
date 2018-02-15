import {get, post} from '../utils/Fetcher';
import {USERS_STORAGE_KEY} from '../consts/storage';
 
const init = () => {
  return {
    users: [],
    userFormShown: null,
    userFormData: {},
    editedUserToken: null,
    teamFetching: false,
    typeFilter: null,
    statusFilter: null,
    projectFilter: null,
    usersActiveTab: 'team'
  }
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
  return {userFormData: {...userFormData}}
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
 
const load = ({dispatchAsync, state}) => {
  const {typeFilter, statusFilter, projectFilter} = state;
  const params = {};
  if (typeFilter) {
    params.typeFilter = typeFilter;
  }
  if (statusFilter) {
    params.statusFilter = statusFilter;
  }
  if (projectFilter) {
    params.projectFilter = projectFilter;
  }
  dispatchAsync('TEAM_FETCHING');
  get('load_users', params)
  .then((data) => {
    dispatchAsync('TEAM_LOADED', data);
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

const change = ({setState}, data) => {
  setState(data);
} 
 
export default {
  localStore: {
    key: USERS_STORAGE_KEY,
    names: [
      'usersActiveTab',
      'typeFilter',
      'statusFilter',
      'projectFilter'
    ]
  },
  actions: {
    load,
    save,
    refresh,
    show_edit_form,
    change
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