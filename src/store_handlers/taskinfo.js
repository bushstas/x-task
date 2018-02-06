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

const load = ({then, getState}, id) => {
  then('CHANGED', {fetching: true});
  get('load_task_info', {id})
  .then((data) => {
    then('CHANGED', {
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

const dispose = ({then}) => {
   then('INIT');
}

 
export default {
  actions: {
    load,
    check_subtask,
    dispose
  },
  reducers: {
    init,
    changed
  }
} 