import StoreKeeper from '../utils/StoreKeeper';
import {APP_STORAGE_KEY, LOCAL_STORAGE_DICTIONARY} from '../consts/storage';
import {get, post} from '../utils/Fetcher';
import {set as setDictionary} from '../utils/Dictionary';

const init = () => {
  return {
      usersActiveTab: 'team',
      appActiveTab: 'tasks',
      accountActiveTab: 'home'
  };
}
 
const change = ({setState}, data) => {
  setState(data);
}

const show_status = ({setState}, data) => {
  get('load_work_status').then(setState);
}

const save_status = ({dispatch}, data) => {
  post('save_work_status', data);
}

const show_board = ({setState}) => {
  setState({shown: 'board'});
}

const hide = ({setState}) => {
  setState({shown: null});
}

const load_dictionary = ({setState}) => {
  return get('dictionary')
  .then(data => {
    setState(data);
    setDictionary(data);
  });
}

export default {
  localStore: {
    key: APP_STORAGE_KEY,
    names: [
      'appActiveTab',
      'usersActiveTab',
      'accountActiveTab',
      'shown'
    ]
  },
  actions: {
  	change,
    show_status,
    save_status,
    show_board,
    hide,
    load_dictionary
  },
  reducers: {
    init
  }
} 