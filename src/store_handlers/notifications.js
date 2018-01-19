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

const added_special = (state, special) => {
  return {special}
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

const removed_special = (state, special) => {
  return {special: null}
}


const add = ({dispatch}, {message, messageFromDict, classes, showtime}) => {
  dispatch('NOTIFICATIONS_ADDED', {message, classes, messageFromDict});
  if (typeof showtime != 'number') {
    showtime = DEFAULT_SHOWTIME;
  }
  setTimeout(() => {
    dispatch('NOTIFICATIONS_REMOVED');
  }, showtime);
}

const add_special = ({dispatch}, {message, messageFromDict, classes}) => {
  dispatch('NOTIFICATIONS_ADDED_SPECIAL', {message, classes, messageFromDict});
  setTimeout(() => {
    dispatch('NOTIFICATIONS_REMOVED_SPECIAL');
  }, 2000);
}

const add_success = ({doAction}, message) => {
  doAction('NOTIFICATIONS_ADD', {message, type: 'success'})
}
 
export default {
  actions: {
    add,
    add_success,
    add_special
  },
  reducers: {
    init,
    added,
    removed,
    added_special,
    removed_special
  }
} 