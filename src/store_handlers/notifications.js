const DEFAULT_SHOWTIME = 30000;

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


const add = ({dispatch}, {message, classes, showtime}) => {
  dispatch('NOTIFICATIONS_ADDED', {message, classes});
  if (typeof showtime != 'number') {
    showtime = DEFAULT_SHOWTIME;
  }
  setTimeout(() => {
    dispatch('NOTIFICATIONS_REMOVED');
  }, showtime);
}

const add_success = ({doAction}, message) => {
  doAction('NOTIFICATIONS_ADD', {message, type: 'success'})
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