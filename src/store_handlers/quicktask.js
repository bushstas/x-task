import StoreKeeper from '../utils/StoreKeeper';
import {START_Y, DEFAULT_SIZES} from '../consts/max_sizes';

const STORAGE_KEY = 'processed_task';
let savedState = StoreKeeper.get(STORAGE_KEY);

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
  markElement: null,
  selectionElement: null,
  taskInfoShown: false,
  info: {},
  bent: false
}

let defaultState = savedState || DEFAULT_STATE;

let timeout;
const onStateChanged = (state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    StoreKeeper.set(STORAGE_KEY, state);
  }, 1000);
}
 
const init = () => {
  return defaultState;
}

const reset = () => {
  return DEFAULT_STATE;
}
 
const activated = (state, status) => {
  return {status}
}

const changed = (state, data) => {
  return data;
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
    importance
  } = state;

  let width = DEFAULT_SIZES[element.type].width,
      height = DEFAULT_SIZES[element.type].height;

  element.data = {
    ...element.data,
    action,
    type,
    importance,
    mx: 0,
    my: START_Y,
    width,
    height
  };

  visualElements.push(element);
  let currentElement = visualElements.length - 1,
      currentType = element.type;
  
  
  let props = {
    visualMode: true,
    status: 'collapsed',
    visualElements,
    currentElement,
    visualElement: {...element},
    currentType
  }

  switch (currentType) {
    case 'mark':
      props.markElement = currentElement;
    break;

    case 'selection':
      props.selectionElement = currentElement;
    break;
  }
  return props;
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
    visualElement: {...element}
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

const deactive_visual_mode = () => {
   return {
    visualMode: false,
    status: 'active'
  }
}

const active_element_unset = () => {
   return {
    visualMode: false,
    status: 'active',
    currentElement: -1,
    visualElement: null
  }
}

const element_removed = (state) => {
  let {
    visualElements,
    currentElement,
    currentType,
    markElement
  } = state;
  visualElements.splice(currentElement, 1);
  let props = {
    visualElements,
    visualMode: false,
    status: 'active',
    currentElement: -1,
    visualElement: null
  };
  switch (currentType) {
    case 'mark':
      props.markElement = null;
      props.bent = false;
    break;

    case 'selection':
      props.selectionElement = null;
      props.bent = false;
      let mark = visualElements[markElement];
      if (mark instanceof Object) {
        mark.data.bent = false
      }
    break;
  }
  return props;
}

const change_param = ({dispatch}, data) => {
  dispatch('QUICKTASK_PARAM_CHANGED', data);
}

const change_visual_element = ({dispatch, state, doAction}, data) => {
  dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', data);
  let {visualElement: {data: d}, currentElement: id} = state;
  let {cut} = data;
  if (typeof cut != 'undefined' || d.cut) {
    let props = {id, cut};
    if (cut || d.cut) {
      let {width, height, mx, my} = d;
      props = {
        width,
        height,
        mx,
        my,
        ...props
      }
      doAction('MASK_CUT_MASK', props);
    }
  }
}

const remove_element = ({dispatch, state, doAction}) => {
  dispatch('QUICKTASK_ELEMENT_REMOVED');
  let {visualElement: {data}, currentElement: id} = state;
  if (data.cut) {
    doAction('MASK_CUT_MASK', {id, cut: false}); 
  }
}

const cancel = ({dispatch}) => {
  dispatch('QUICKTASK_RESET');
}


export default {
  onStateChanged,
  actions: {
    change_param,
    change_visual_element,
    remove_element,
    cancel
  },
  reducers: {
    init,
    reset,
    activated,    
    param_changed,
    changed,
    form_data_changed,
    visual_element_added,
    visual_element_changed,
    element_set_active,
    active_element_unset,
    deactive_visual_mode,
    element_removed
  }
} 