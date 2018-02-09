const DEFAULT_SHOWTIME = 30000;

const init = () => {
  return {
     items: []
  };
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


const add = ({then}, {message, messageFromDict, classes, showtime}) => {
  then('ADDED', {message, classes, messageFromDict});
  if (typeof showtime != 'number') {
    showtime = DEFAULT_SHOWTIME;
  }
  setTimeout(() => {
    then('REMOVED');
  }, showtime);
}

const add_special = ({then}, {message, messageFromDict, classes}) => {
  then('ADDED_SPECIAL', {message, classes, messageFromDict});
  setTimeout(() => {
    then('REMOVED_SPECIAL');
  }, 2000);
}

const add_success = ({and}, message) => {
  and('ADD', {message, type: 'success'})
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