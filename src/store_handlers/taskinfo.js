import {get, post} from '../utils/Fetcher';
 
const init = () => {
  return {
    data: null,
    fetching: false,
    listChecked: [],
    widthStyle: {}
  }
}

const changed = (state, data) => {
   return data;
}

const load = ({dispatchAsync, setState, getState}, id) => {
  dispatchAsync('TASKINFO_CHANGED', {fetching: true}); 
  get('task_get_data', {id})
  .then((data) => {
    setState({
      fetching: false,
      data,
      id: data.id,
      widthStyle: {width: data.task.scale + '%'}
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
  post('task_check_subtask', {id, idx, checked});
}

const change = ({setState}, data) => {
   setState(data);
}

 
export default {
  actions: {
    load,
    check_subtask,
    change
  },
  reducers: {
    init,
    changed
  }
} 