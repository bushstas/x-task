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
  get('load_projects')
  .then((data) => {
    then('LOADED', data);
  });
}

const load_list = ({setState}) => {
  get('load_projects_list').then(setState);
}

const load_releases = ({setState}) => {
  get('load_releases_list').then(setState);
}

const reset_list = ({setState}) => {
  setState({
    projectsList: null,
    releasesList: null
  });
}

const show_edit_form = ({then}, projectToken) => {
  post('get_project_data', {projectToken})
    .then(({project, dict}) => {
      then('EDIT_FORM_SHOWN', {projectToken, project, dict});
    });   
}

const save = ({then, state, and}, {token}) => {
    let {formData} = state;
    post('save_project', {projectToken: token, ...formData})
    .then(
        () => {
          initTaskResolver(formData);
          then('CANCELED');
          and('LOAD');
        }
    );
}

const request_access = ({doAction}, projectToken) => {
  post('request_project_access', {projectToken})
    .then(({message}) => {
      doAction('NOTIFICATIONS_ADD_SUCCESS', message);
    });   
}

const activate = ({and}, {token, homepage}) => {
    post('activate_project', {projectToken: token})
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