
const DEFAULT_STATE = {
   items: []
}
 
/**
 ===============
 Reducers
 ===============
*/
 
const init = () => {
  return DEFAULT_STATE;
}
 
const added = (state, data) => {
  return {
    items: [
      data,
      ...state.items      
    ]
  }
}

const removed = (state, data) => {
  let {items} = state;
  items.splice(items.length - 1, 1);
  return {
    items: [
      ...items      
    ]
  }
}


const add = ({dispatch}, {message, classes}) => {
  dispatch('NOTIFICATIONS_ADDED', {message, classes});
  setTimeout(() => {
    dispatch('NOTIFICATIONS_REMOVED');
  }, 30000);
}

const add_success = ({doAction}, message) => {
  doAction('NOTIFICATIONS_ADD', {message, classes: 'x-task-success'})
}
 
export default {
  actions: {
    add,
    add_success
  },
  reducers: {
    init,
    added,
    removed
  }
} 