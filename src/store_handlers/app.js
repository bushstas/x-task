import StoreKeeper from '../utils/StoreKeeper';
import {APP_STORAGE_KEY, LOCAL_STORAGE_DICTIONARY} from '../consts/storage';
import {get} from '../utils/Fetcher';
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
    show_board,
    hide,
    load_dictionary
  },
  reducers: {
    init
  }
} 