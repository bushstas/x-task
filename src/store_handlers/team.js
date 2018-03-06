import {get, post} from '../utils/Fetcher';
import {USERS_STORAGE_KEY} from '../consts/storage';
 
const init = () => {
  return {
    users: null,
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
  data.teamFetching = false;
  return data;
}

const form_data_changed = (state, userFormData) => {
  return {userFormData}
}

const edit_form_shown = (state, {user, userToken}) => {
  return {
    editedUserToken: userToken,
    userFormData: user
  }
}

const canceled = (state) => {
   return {
    editedUserToken: null,
    userFormData: {}
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

const handleUserSaved = (doAction) => {
  doAction('MODALS_HIDE', 'user_form');
  doAction('TEAM_REFRESH');
}

const create_user = ({state, doAction}) => {
    let {userFormData} = state;
    post('create_user', userFormData)
      .then(() => handleUserSaved(doAction));
}

const save_user = ({state, doAction}, userId) => {
    let {userFormData} = state;
    userFormData.userId = userId;
    post('save_user', userFormData)
      .then(() => handleUserSaved(doAction));
}

const refresh = ({setState}) => {
  setState({teamFetching: true});
  get('refresh_users').then(users => {
    setState({
      users,
      userFormData: {},
      teamFetching: false
    });
  });
}

const show_add_form = ({setState, doAction}) => {
  setState({userFormData: {}});
  doAction('MODALS_SHOW', {name: 'user_form'});
}

const show_edit_form = ({setState, doAction}, userId) => {
  setState({userFormData: {}});
  get('get_user_data', {userId})
    .then(({user}) => {
      setState({userFormData: user});
    });
    doAction('MODALS_SHOW', {name: 'user_form', props: {id: userId}});
}

const change = ({setState}, data) => {
  setState(data);
} 

const update = ({and, state}) => {
  if (state.users) {
    and('LOAD');
  }
}
 
export default {
  localStore: {
    key: USERS_STORAGE_KEY,
    names: [
      'usersActiveTab',
      'typeFilter',
      'statusFilter',
      'projectFilter',
      'userFormData'
    ]
  },
  actions: {
    load,
    create_user,
    save_user,
    refresh,
    show_add_form,
    show_edit_form,
    change,
    update
  },
  reducers: {
    init,
    fetching,
    loaded,
    form_data_changed,
    edit_form_shown,
    canceled
  }
} 