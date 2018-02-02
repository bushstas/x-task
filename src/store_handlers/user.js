import {get, post} from '../utils/Fetcher';
import StoreKeeper from '../utils/StoreKeeper';
import {set as setUser} from '../utils/User';
import {LOCAL_STORAGE_TOKEN} from '../consts/storage';
import {init as initTaskResolver} from '../utils/TaskResolver';

const init = () => {
  return {
    user: null,
    project: null,
    rights: [],
    isAuthorized: false
  };
}
 
const changed = (state, data) => {
  return data;
}

const loaded = (state, data) => {
  let isAuthorized = false;
  if (data.errcode) {
    StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
  } else if (data.user instanceof Object) {
    isAuthorized = true;
  }
  return {
    ...data,
    isAuthorized
  }
}

const load = ({dispatch, state}, filter) => {
  if (StoreKeeper.get(LOCAL_STORAGE_TOKEN)) {
    return (
      get('load_user')
      .then(
        data => {
          setUser(data);
          initTaskResolver(data.user);
          dispatch('USER_LOADED', data);
        },
        () => StoreKeeper.remove(LOCAL_STORAGE_TOKEN)
      )
    )
  }
  return Promise.resolve();
}

const set_project = ({dispatch}, id) => {
  return post('set_project', {id})
  .then(data => {
    setUser(data);
    dispatch('USER_CHANGED', data);
  });
}

const auth = ({doAction}, data) => {
  post('auth', data)
  .then(({token}) => {
    if (token) {
      StoreKeeper.set(LOCAL_STORAGE_TOKEN, token);
      doAction('USER_LOAD');
    }
  });
}

const register = ({doAction}, data) => {
  post('auth', data)
  .then(({token}) => {
    if (token) {
      StoreKeeper.set(LOCAL_STORAGE_TOKEN, token);
      doAction('USER_LOAD');
    }
  });
}

export default {
  actions: {
  	load,
    set_project,
    auth,
    register,
    // logout
  },
  reducers: {
    init,
    changed,
    loaded
  }
} 




// export const setProject = (id) => {
//   return post('set_project', {id})
//       .then(onLoad, onFail);
// }

// const doAction = (action, data) => {
//   loaded = false;
//   let cb = function(data) {
//     StoreKeeper.set(LOCAL_STORAGE_TOKEN, data.token);
//     load();
//   };
//   post(action, data).then(cb);
// }

// export const register = (data) => {
//   if (!data.login) {
//     data.login = '';
//   }
//   doAction('register', data);
//   return {then}
// }

// export const logout = () => {
//   post('logout');
//   user = null;
//   currentProject = null;
//   StoreKeeper.remove(LOCAL_STORAGE_TOKEN);
//   StoreKeeper.remove(APP_STORAGE_KEY);
//   StoreKeeper.remove(TASKS_STORAGE_KEY);
//   StoreKeeper.remove(QUICKTASK_STORAGE_KEY);
//   Store.reset();
//   return {then}
// }