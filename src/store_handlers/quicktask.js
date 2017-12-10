const DEFAULT_STATE = {
  active: false,
  formData: {},
  importance: 'usual',
  type: null,
  action: null,
  visualElements: [],
  visualMode: false
}
 
const init = () => {
  return DEFAULT_STATE;
}
 
const activated = (state, active) => {
  return {
    ...state,
    active
  }
}

const importance_changed = (state, importance) => {
  return {
    ...state,
    importance
  }
}

const type_changed = (state, type) => {
  return {
    ...state,
    type
  }
}

const action_changed = (state, action) => {
  return {
    ...state,
    action
  }
}

const form_data_changed = (state, formData) => {
  return {
    ...state,
    formData
  }
}

const visual_element_added = (state, element) => {
  let {visualElements} = state;
  visualElements.push(element);
  return {
    ...state,
    visualMode: true,
    active: false,
    visualElements
  }
}

const coords_changed = (state, data) => {
  let {visualElements} = state;
  let {index, mx, my} = data;
  if (visualElements[index] instanceof Object) {
    visualElements[index].data.mx = mx;
    visualElements[index].data.my = my;
  }
  return {
    ...state,
    visualElements
  }
}

const loc_changed = (state, data) => {
  let {visualElements} = state;
  let {index, loc} = data;
  if (visualElements[index] instanceof Object) {
    visualElements[index].data.loc = loc;
  }
  return {
    ...state,
    visualElements
  }
}


export default {
  actions: {

  },
  reducers: {
    init,
    activated,
    importance_changed,
    type_changed,
    action_changed,
    form_data_changed,
    visual_element_added,
    coords_changed,
    loc_changed
  }
} 