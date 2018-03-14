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

const hide = ({setState, state, then}, name = null) => {
  if (!name) {
    then('INIT');  
  } else {
    let {modals} = state;
    delete modals[name];
    setState({modals});
  }
}

const change = ({setState, state}, {name, props}) => {
  let {modals} = state;
  modals[name] = {
    ...modals[name],
    ...props
  };
  setState({modals});
}

export default {
  localStore: {
    key: 'modals'
  },
  actions: {
  	show,
    hide,
    change
  },
  reducers: {
    init
  }
} 