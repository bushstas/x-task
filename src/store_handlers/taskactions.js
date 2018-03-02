import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
 
const init = (state, taskId = null) => {
  return {
    actions: null,
    dict: null,
    taskId
  };
}

const load = ({then, setState}, id) => {
  then('INIT', id);
  get('load_task_actions', {id})
  .then(({actions, dict}) => {
    setState({actions, dict});
  });
}

const action = ({state}, name) => {
  let {taskId: id} = state;
  return get('task_action', {name, id});
}
 
const edit = ({state, getState}) => {
  let {taskId} = state;
  let tasks = getState('tasks.tasks');
  for (let t of tasks) {
    if (t.id == taskId) {
      editTask(taskId, t.data.urls[0]);
      break;
    }
  }
}

const remove = ({setState}, removeClicked) => {
  setState({removeClicked});
}

export default {
  actions: {
    load,
    action,
    edit,
    remove
  },
  reducers: {
    init
  }
} 