import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  fetching: true,
  projects: []
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
 
/**
 ===============
 Actions
 ===============
*/
 
const load = ({dispatch}) => {
  dispatch('PROJECTS_FETCHING');
  get('load_projects')
  .then((data) => {
    dispatch('PROJECTS_LOADED', data);
  });
}
 
 
export default {
  actions: {
    load
  },
  reducers: {
    init,
    fetching,
    loaded
  }
} 