import {get, post} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  data: null,
  fetching: false,
  listChecked: []
}
 

const init = () => {
  return DEFAULT_STATE;
}

const changed = (state, data) => {
   return data;
}

const load = ({dispatch, getState}, id) => {
  dispatch('TASKINFO_CHANGED', {fetching: true});
  get('load_task_info', {id})
  .then((data) => {
    dispatch('TASKINFO_CHANGED', {
      fetching: false,
      data
    });
  });
}

const check_subtask = ({dispatch, state}, {idx, checked, id}) => {
  let {listChecked} = state;
  if (checked) {
    listChecked.push(~~idx);
  } else {
    let index = listChecked.indexOf(~~idx);
    if (index > -1) {
      listChecked.splice(index, 1);
    }
  }
  dispatch('TASKINFO_CHANGED', {listChecked});
  post('check_subtask', {id, idx, checked});
}
 
 
export default {
  actions: {
    load,
    check_subtask
  },
  reducers: {
    init,
    changed
  }
} 