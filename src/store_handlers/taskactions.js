import {editTask} from '../utils/TaskResolver';
import {get, post} from '../utils/Fetcher';
 
const init = (state, taskId = null) => {
  return {
    actions: null,
    dict: null,
    taskId
  };
}

const changed = (state, data) => {
  return data;
}

const load = ({dispatch}, id) => {
  dispatch('TASKACTIONS_INIT', id);
  get('load_task_actions', {id})
  .then(({actions, dict}) => {
    dispatch('TASKACTIONS_CHANGED', {actions, dict});
  });
}

const action = ({doAction, state, getState}, name) => {
  let {taskId: id} = state;
  return get('task_action', {name, id});
}
 
const edit = ({doAction, state, getState}) => {
  let {taskActionsData: {task_id: id}, tasks} = state;
  for (let t of tasks) {
    if (t.id == id) {
      editTask(id, t.data.urls[0]);
      break;
    }
  }
}

export default {
  actions: {
    load,
    action,
    edit
  },
  reducers: {
    init,
    changed
  }
} 