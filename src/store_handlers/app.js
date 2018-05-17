import {APP_STORAGE_KEY, LOCAL_STORAGE_DICTIONARY} from '../consts/storage';
import {get} from '../utils/Fetcher';
import {set as setDictionary} from '../utils/Dictionary';

const init = () => {
  return {
      appActiveTab: 'tasks',
      accountActiveTab: 'home'
  };
}
 
const change = ({setState}, data) => {
  setState(data);
}

const show = ({setState}, shown) => {
  setState({shown});
}

const hide = ({setState}) => {
  setState({shown: null});
}

const load_dictionary = ({setState, state}) => {
  if (state.dict && state.icons) {
    setDictionary(state);
    return Promise.resolve();
  }
  return get('dict_get')
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
      'accountActiveTab',
      'shown',
      'dict',
      'icons'
    ],
    lifetime: '1hour'
  },
  actions: {
  	change,
    show,
    hide,
    load_dictionary
  },
  reducers: {
    init
  }
} 