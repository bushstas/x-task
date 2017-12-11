const DEFAULT_STATE = {
  status: null,
  formData: {},
  importance: 'usual',
  type: null,
  action: null,
  visualElements: [],
  visualMode: false,
  currentElement: -1,
  currentType: null,
  visualElement: null,
  markElement: null
}
 
const init = () => {
  return DEFAULT_STATE;
}
 
const activated = (state, status) => {
  return {status}
}

const param_changed = (state, data) => {
  let {markElement: m, visualElements: e} = state;
  if (typeof m == 'number' && e[m] instanceof Object) {
    let {data: d} = e[m];
    e[m].data = {
      ...d,
      ...data
    }
  }
  return {
    visualElements: e,
    ...data
  };
}

const type_changed = (state, type) => {
  return {type}
}

const action_changed = (state, action) => {
  return {action}
}

const form_data_changed = (state, formData) => {
  return {formData}
}

const visual_element_added = (state, element) => {
  let {
    visualElements,
    action,
    type,
    importance,
    markElement
  } = state;

  element.data = {
    ...element.data,
    action,
    type,
    importance
  };
  visualElements.push(element);
  let currentElement = visualElements.length - 1,
      currentType = element.type;
  
  if (currentType == 'mark') {
    markElement = currentElement;
  }
  return {
    visualMode: true,
    status: 'collapsed',
    visualElements,
    currentElement,
    visualElement: element,
    currentType, 
    markElement
  }
}

const visual_element_changed = (state, data) => {
  let {visualElements, currentElement} = state;
  let element = visualElements[currentElement];
  if (element instanceof Object) {
    element.data = {
      ...element.data,
      ...data
    }
  }
  return {
    visualElements,
    visualElement: element
  }
}

const element_set_active = (state, currentElement) => {
  let {visualElements} = state,
      visualElement = visualElements[currentElement],
      currentType = visualElement.type;

  return {
    currentElement,
    visualElement,
    visualMode: true,
    status: 'collapsed',
    currentType
  }
}

const active_element_unset = () => {
   return {
    visualMode: false,
    status: 'active'
  }
}

const change_param = ({dispatch}, data) => {
  dispatch('QUICKTASK_PARAM_CHANGED', data);
}

const change_visual_element = ({dispatch}, data) => {
  dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', data);
}


export default {
  actions: {
    change_param,
    change_visual_element
  },
  reducers: {
    init,
    activated,    
    param_changed,
    form_data_changed,
    visual_element_added,
    visual_element_changed,
    element_set_active,
    active_element_unset
  }
} 