import {get, post} from '../utils/Fetcher';
import {init as initTaskResolver} from '../utils/TaskResolver';
  
const init = () => {
  return {
    fetching: true,
    projects: [],
    formShown: null,
    formData: {},
    editedProject: null,
    dict: {}
  }
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

const edit_form_shown = (state, {project, projectToken, dict}) => {
  let {dict: dictionary} = state;
  return {
    editedProject: projectToken,
    formShown: 'edit',
    formData: project,
    dict: {
      ...dictionary,
      ...dict
    }
  }
}

const add_form_shown = (state) => {
  return {formShown: 'add'}
}

const canceled = (state) => {
   return {
    releases: null,
    editedProject: null,
    formShown: null,
    formData: {}
  }
}

const form_data_changed = (state, formData) => {
  return {formData}
}

const load = ({then, dispatchAsync}) => {
  dispatchAsync('PROJECTS_FETCHING');
  get('project_get')
  .then((data) => {
    then('LOADED', data);
  });
}

const load_list = ({setState}) => {
  get('project_get_list').then(setState);
}

const load_releases = ({setState}) => {
  get('release_get_list').then(setState);
}

const reset_list = ({setState}) => {
  setState({
    projectsList: null,
    releasesList: null
  });
}

const show_edit_form = ({then}, projectToken) => {
  get('project_get_edited', {projectToken})
    .then(({project, dict}) => {
      then('EDIT_FORM_SHOWN', {projectToken, project, dict});
    });   
}

const save = ({then, state, and}, {token}) => {
    let {formData} = state;
    post('project_save', {projectToken: token, ...formData})
    .then(
        () => {
          initTaskResolver(formData);
          then('CANCELED');
          and('LOAD');
        }
    );
}

const request_access = ({doAction}, projectToken) => {
  post('project_request_access', {projectToken})
    .then(({message}) => {
      doAction('NOTIFICATIONS_ADD_SUCCESS', message);
    });   
}

const activate = ({and}, {token, homepage}) => {
    post('project_activate', {projectToken: token})
    .then(
        () => {
          if (homepage) {
            location.href = homepage;
          } else {
            and('LOAD');
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
    activate,
    load_list,
    reset_list,
    load_releases
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