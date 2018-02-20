import {get, post} from '../utils/Fetcher';
 
const init = () => {
  return {
    data: null,
    fetching: false,
    listChecked: []
  }
}

const changed = (state, data) => {
   return data;
}

const load = ({dispatchAsync, setState, getState}, id) => {
  dispatchAsync('TASKINFO_CHANGED', {fetching: true}); 
  get('load_task_info', {id})
  .then((data) => {
    setState({
      fetching: false,
      data,
      id: data.id
    });
  });
}

const check_subtask = ({setState, state}, {idx, checked, id}) => {
  let {listChecked} = state;
  if (checked) {
    listChecked.push(~~idx);
  } else {
    let index = listChecked.indexOf(~~idx);
    if (index > -1) {
      listChecked.splice(index, 1);
    }
  }
  setState({listChecked});
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