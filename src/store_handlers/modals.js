const init = () => {
  return {
    modals: {}
  };
}
 
const changed = (state, data) => {
  return data;
}

const show = ({dispatch, state}, {name, props = {}}) => {
  let {modals} = state;
  modals[name] = props;
  dispatch('MODALS_CHANGED', {modals});
}

const hide = ({dispatch, state}, name) => {
  let {modals} = state;
  delete modals[name];
  dispatch('MODALS_CHANGED', {modals});
}

export default {
  actions: {
  	show,
    hide
  },
  reducers: {
    init,
    changed
  }
} 