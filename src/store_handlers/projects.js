import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  fetching: true,
  projects: [],
  formShown: null,
  formData: {},
  editedProject: null
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
  return {fetching: true}
}

const loaded = (state, data) => {
  return {
    ...data,
    fetching: false
  }
}

const edit_form_shown = (state, {project, projectToken}) => {
  return {
    editedProject: projectToken,
    formShown: 'edit',
    formData: project
  }
}

const add_form_shown = (state) => {
  return {formShown: 'add'}
}

const canceled = (state) => {
   return {
    editedProject: null,
    formShown: null,
    formData: {}
  }
}

const form_data_changed = (state, formData) => {
  return {formData}
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

const show_edit_form = ({dispatch}, projectToken) => {
  post('get_project_data', {projectToken})
    .then(({project}) => {
      dispatch('PROJECTS_EDIT_FORM_SHOWN', {projectToken, project});
    });   
}

const save = ({dispatch, state, doAction}, {token}) => {
    let {formData} = state;
    post('save_project', {projectToken: token, ...formData})
    .then(
        () => doAction('PROJECTS_LOAD')
    );
}

const request_access = ({doAction}, projectToken) => {
  post('request_project_access', {projectToken})
    .then(({message}) => {
      doAction('NOTIFICATIONS_ADD_SUCCESS', message);
    });   
}

const activate = ({doAction}, {token, homepage}) => {
    post('activate_project', {projectToken: token})
    .then(
        () => {
          if (homepage) {
            location.href = homepage;
          } else {
            doAction('PROJECTS_LOAD');
          }
        }
    ); 
} 
 
export default {
  actions: {
    load,
    save,
    show_edit_form,
    request_access,
    activate
  },
  reducers: {
    init,
    fetching,
    loaded,
    edit_form_shown,
    add_form_shown,
    canceled,
    form_data_changed
  }
} 