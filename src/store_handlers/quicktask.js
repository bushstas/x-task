const DEFAULT_STATE = {
  active: false,
  formData: {},
  importance: 'usual',
  type: null,
  action: null,
  visualElements: [],
  visualMode: false,
  currentElement: null,
  visualElement: null
}
 
const init = () => {
  return DEFAULT_STATE;
}
 
const activated = (state, active) => {
  return {active}
}

const param_changed = (state, data) => {
  let {visualElement} = state;
  if (visualElement instanceof Object) {
    visualElement.data = {
      ...visualElement.data,
      data
    }
  }
  return {
    ...data,
    visualElement
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
  let {visualElements, action, type, importance} = state;
  element.data = {
    ...element.data,
    action,
    type,
    importance
  };
  visualElements.push(element);
  let currentElement = visualElements.length - 1;
  return {
    visualMode: true,
    active: false,
    visualElements,
    currentElement,
    visualElement: element
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
    visual_element_changed
  }
} 