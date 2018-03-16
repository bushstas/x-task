import {get, post} from '../utils/Fetcher';

const init = () => {
  return {
    avatars: null
  };
}

const load = ({setState}) => {
 	get('load_avatars').then(setState);
}

export default {
  actions: {
    load
  },
  reducers: {
  	init
  }
} 