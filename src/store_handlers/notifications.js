
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


const add = ({dispatch}, data) => {
  dispatch('NOTIFICATIONS_ADDED', data);
  setTimeout(() => {
    dispatch('NOTIFICATIONS_REMOVED');
  }, 3000);
}
 
export default {
  actions: {
    add
  },
  reducers: {
    init,
    added,
    removed
  }
} 