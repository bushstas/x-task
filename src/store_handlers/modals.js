const init = () => {
  return {
    modals: {}
  };
}
 
const show = ({setState, state}, {name, props = {}}) => {
  let {modals} = state;
  modals[name] = props;
  setState({modals});
}

const hide = ({setState, state}, name) => {
  let {modals} = state;
  delete modals[name];
  setState({modals});
}

export default {
  actions: {
  	show,
    hide
  },
  reducers: {
    init
  }
} 