import {get, post} from '../utils/Fetcher';
import StoreKeeper from '../utils/StoreKeeper';
import {set as setUser} from '../utils/User';
import {LOCAL_STORAGE_TOKEN, APP_STORAGE_KEY, TASKS_STORAGE_KEY, QUICKTASK_STORAGE_KEY} from '../consts/storage';
import {init as initTaskResolver} from '../utils/TaskResolver';

const init = () => {
  return {
    user: null,
    project: null,
    rights: [],
    isAuthorized: false
  };
}
 
const loaded = (state, data) => {
  let isAuthorized = false;
  if (data.errcode) {
    StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
  } else if (data.user instanceof Object) {
    isAuthorized = true;
  }
  data.project.bgStyle =  {
    backgroundColor: '#' + data.project.color
  }
  return {
    ...data,
    isAuthorized
  }
}

const load = ({then, state}, filter) => {
  if (StoreKeeper.get(LOCAL_STORAGE_TOKEN)) {
    return (
      get('load_user')
      .then(
        data => {
          setUser(data);
          initTaskResolver(data.user);
          then('LOADED', data);
        },
        () => StoreKeeper.remove(LOCAL_STORAGE_TOKEN)
      )
    )
  }
  return Promise.resolve();
}

const set_project = ({setState}, id) => {
  return post('set_project', {id})
  .then(data => {
    data.project.bgStyle =  {
      backgroundColor: '#' + data.project.color
    }
    setUser(data);
    setState(data);
  });
}

const auth = ({and}, data) => {
  post('auth', data)
  .then(({token}) => {
    if (token) {
      StoreKeeper.set(LOCAL_STORAGE_TOKEN, token);
      and('LOAD');
    }
  });
}

const register = ({and}, data) => {
  post('auth', data)
  .then(({token}) => {
    if (token) {
      StoreKeeper.set(LOCAL_STORAGE_TOKEN, token);
      and('LOAD');
    }
  });
}

const logout = ({reset}, data) => {
  post('logout');
  StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
  StoreKeeper.remove(APP_STORAGE_KEY);
  StoreKeeper.remove(TASKS_STORAGE_KEY);
  StoreKeeper.remove(QUICKTASK_STORAGE_KEY);
  reset();
}


export default {
  actions: {
  	load,
    set_project,
    auth,
    register,
    logout
  },
  reducers: {
    init,
    loaded
  }
}