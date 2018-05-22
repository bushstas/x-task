import {get, post} from '../utils/Fetcher';
import {USERS_STORAGE_KEY} from '../consts/storage';
 
const init = () => {
  return {
    users: null,
    fetching: false,
    typeFilter: null,
    statusFilter: null,
    projectFilter: null
  }
}

const loaded = (state, data) => {
  data.fetching = false;
  return data;
}

const fetching = (state) => {
  return {fetching: true}
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
  get('user_get', params)
  .then((data) => {
    dispatchAsync('TEAM_LOADED', data);
  });
}

const refresh = ({setState}) => {
  setState({fetching: true});
  get('user_refresh').then(({users}) => {
    setState({
      users,
      fetching: false
    });
  });
}

const show_add_form = ({setState, doAction}) => {
  doAction('MODALS_SHOW', {name: 'user_form'});
}

const show_edit_form = ({setState, doAction}, userId) => {
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
      'typeFilter',
      'statusFilter',
      'projectFilter'
    ]
  },
  actions: {
    load,
    refresh,
    show_add_form,
    show_edit_form,
    change,
    update
  },
  reducers: {
    init,
    loaded,
    fetching
  }
} 