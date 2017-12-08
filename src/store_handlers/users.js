import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  data: {},
  activeTab: 'users',
  fetching: true,
  userFormShown: null,
  userFormData: {},
  editedUserToken: null
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
  return {
    ...state,
    fetching: true
  }
}

const loaded = (state, data) => {
  return {
    ...state,
    ...data,
    fetching: false
  }
}

const tab_changed = (state, activeTab) => {
  return {
    ...state,
    activeTab
  }
}
 
const user_form_data_changed = (state, userFormData) => {
  return {
    ...state,
    userFormData: {
      ...userFormData
    }
  }
}

const editing_user_form_shown = (state, {user, userToken}) => {
  return {
    ...state,
    editedUserToken: userToken,
    userFormShown: 'edit',
    userFormData: user,
    fetching: false    
  }
}

const adding_user_form_shown = (state) => {
  return {
    ...state,
    userFormShown: 'add'
  }
}

const canceled = (state) => {
   return {
    ...state,
    editedUserToken: null,
    userFormShown: null,
    userFormData: {}
  }
}

const user_saved = (state, users) => {
   return {
    ...state,
    users,
    editedUserToken: null,
    userFormShown: null,
    userFormData: {},
    fetching: false
  }
}
 
/**
 ===============
 Actions
 ===============
*/
 
const load = ({dispatch}) => {
  dispatch('USERS_FETCHING');
  get('load_users')
  .then((data) => {
    dispatch('USERS_LOADED', data);
  });
}

const save_user = ({dispatch, state}, {token}) => {
  dispatch('USERS_FETCHING'); 

  let {userFormData} = state;
  post('save_user', {userToken: token, ...userFormData})
  .then(() => {
    get('refresh_users')
    .then(({users}) => {
      dispatch('USERS_USER_SAVED', users);
    });
  });
}

const show_editing_user_form = ({dispatch}, userToken) => {
  dispatch('USERS_FETCHING');
  post('get_user_data', {userToken})
    .then(({user}) => {
      dispatch('USERS_EDITING_USER_FORM_SHOWN', {userToken, user});
    });   
}
 
 
export default {
  actions: {
    load,
    save_user,
    show_editing_user_form
  },
  reducers: {
    init,
    fetching,
    loaded,
    tab_changed,
    user_form_data_changed,
    adding_user_form_shown,
    editing_user_form_shown,
    canceled,
    user_saved
  }
} 