import {get} from '../utils/Fetcher';

const init = () => {
  return {
    fetching: true
  };
}
 
const changed = (state, data) => {
  return data;
}

const fetched = (state, data) => {
  return {
    fetching: false,
    ...data
  };
}

const load = ({dispatch}) => {
  get('load_board')
  .then(boardData => {
    dispatch('BOARD_FETCHED', boardData);
  });
}

export default {
  actions: {
  	load
  },
  reducers: {
    init,
    changed,
    fetched
  }
} 