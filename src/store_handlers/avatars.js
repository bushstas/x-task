import {get, post} from '../utils/Fetcher';

const init = () => {
  return {
    avatars: null
  };
}

const load = ({setState}) => {
 	get('avatar_get_list').then(setState);
}

export default {
  actions: {
    load
  },
  reducers: {
  	init
  }
} 