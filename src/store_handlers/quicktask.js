import StoreKeeper from '../utils/StoreKeeper';
import {START_Y, DEFAULT_SIZES} from '../consts/max_sizes';
import {DEFAULT_BRUSH_SIZE, DEFAULT_COLOR, DEFAULT_OPACITY} from '../consts/colors';
import {getScrollTop, getElementMarginLeft, getCenterCoords, generateKey} from '../utils';
import {getUrl} from '../utils/TaskResolver';
import {get} from '../utils/Fetcher';

const STORAGE_KEY = 'processed_task';
let savedState = StoreKeeper.get(STORAGE_KEY);
if (savedState) {
  delete savedState.urlDialogData;
}

const getDefaultState = () => {
  return {
    status: null,
    formData: {
      url: getUrl()
    },
    importance: 'usual',
    type: null,
    action: null,
    visualElements: {},
    visualMode: false,
    currentElement: null,
    currentType: null,
    visualElement: null,
    markElement: null,
    selectionElement: null,
    taskInfoShown: false,
    info: {},
    bent: false,
    uiPanelShown: false,
    urlDialogData: null,
    dialogFetching: false
  }
}

let defaultState = savedState || getDefaultState();
let timeout;
const onStateChanged = (state) => {
  let {status} = state;
  if (!status) {
    StoreKeeper.remove(STORAGE_KEY);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      StoreKeeper.set(STORAGE_KEY, state);
    }, 500);
  }
}
 
const init = () => {
  return defaultState;
}

const reset = () => {
  return getDefaultState();
}
 
const activated = (state, status) => {
  return {status}
}

const param_changed = (state, data) => {
  return data;
}

const form_data_changed = (state, formData) => {
  return {formData}
}

const visual_element_changed = (state, data) => {
  let {visualElements, currentElement} = state;
  let visualElement = visualElements[currentElement];
  if (visualElement instanceof Object) {
    visualElement.data = {
      ...visualElement.data,
      ...data
    }
  }
  return {
    visualElements,
    visualElement
  }
}

const change_param = ({dispatch, doAction}, data) => {
  let state = dispatch('QUICKTASK_PARAM_CHANGED', data);
  if (
    typeof data.currentElement != 'undefined' || 
    typeof data.layers != 'undefined' || 
    (data.currentElement && state.layers)
  ) {
    let {currentElement, layers} = state;
    doAction('MASK_CHANGE', {layers: layers, id: currentElement}); 
  }
}

const change_visual_element = ({dispatch, doAction}, data) => {
  let state = dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', data);
  let {visualElement: {data: d}, currentElement: id} = state;
  let {cut, my} = data;
  let {fixed} = d;
  if (typeof cut != 'undefined' || (typeof my != 'undefined' && d.cut)) {
    let props = {id, cut};
    if (cut || d.cut) {
      let {width, height, mx, my} = d;
      props = {
        width,
        height,
        mx,
        my,
        fixed,
        ...props
      }
    }
    doAction('MASK_CUT_MASK', props);
  }
}

const add_element = ({doAction, state}, type) => {
  let {
    visualElements,
    markElement,
    selectionElement
  } = state;

  let width = DEFAULT_SIZES[type].width,
      height = DEFAULT_SIZES[type].height;

  let data = {
    type,
    data: {  
      mx: 0,
      my: START_Y + getScrollTop(),
      width,
      height
    }
  }  

  let currentElement = generateKey(),
      currentType = type;
  visualElements[currentElement] = data;

  
  switch (currentType) {
    case 'mark':
      markElement = currentElement;
    break;

    case 'selection':
      selectionElement = currentElement;
    break;

    case 'drawing':
      data.data.brushSize = DEFAULT_BRUSH_SIZE;
      data.data.color = DEFAULT_COLOR;
      data.data.opacity = DEFAULT_OPACITY;
    break;    
  }
  
  let props = {
    markElement,
    selectionElement,
    visualMode: true,
    status: 'collapsed',
    visualElements,
    currentElement,
    visualElement: data,
    currentType
  }
  doAction('QUICKTASK_CHANGE_PARAM', props);
}

const remove_element = ({state, doAction}) => {
 let {
    visualElements,
    visualElement: {data},
    currentElement,
    currentType,
    markElement
  } = state;

  if (data.cut) {
    doAction('MASK_CUT_MASK', {id: currentElement, cut: false}); 
  } 
  if (
    typeof markElement == 'number' &&
    markElement > currentElement
  ) {
    markElement--;
  }
  delete visualElements[currentElement];
  let props = {
    visualElements,
    markElement,
    visualMode: false,
    status: 'active',
    currentElement: null,
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
    break;
  }
  doAction('QUICKTASK_CHANGE_PARAM', props);
}

const relocate_element = ({doAction, state}, coords) => {
  let mx, my;
  if (coords) {
    mx = getElementMarginLeft(coords.x);
    my = coords.y;
  } else {
    let {visualElement: {data: {width, height}}} = state;
    let centerCoords = getCenterCoords();
    mx = -width / 2;
    my = centerCoords.y - height / 2;
  }
  doAction('QUICKTASK_CHANGE_VISUAL_ELEMENT', {mx, my}); 
}

const set_element_active = ({doAction, state}, currentElement) => {
  let {visualElements} = state,
      visualElement = visualElements[currentElement],
      currentType = visualElement.type;

  doAction('QUICKTASK_CHANGE_PARAM', {
    currentElement,
    visualElement,
    visualMode: true,
    status: 'collapsed',
    currentType,
    uiPanelShown: false
  });
}

const unset_active_element = ({doAction}) => {
   doAction('QUICKTASK_CHANGE_PARAM', {
    visualMode: false,
    status: 'active',
    currentElement: null,
    visualElement: null
  });
}

const cancel = ({dispatch}) => {
  dispatch('MASK_CLEARED');
  dispatch('QUICKTASK_RESET');
}

const show_url_dialog = ({dispatch}) => {
  dispatch('QUICKTASK_PARAM_CHANGED', {dialogFetching: true});
  get('load_url_dialog')
  .then((urlDialogData) => {
    dispatch('QUICKTASK_PARAM_CHANGED', {
      dialogFetching: false,
      urlDialogData
    });
  });
}

export default {
  onStateChanged,
  actions: {
    add_element,
    change_param,
    change_visual_element,
    remove_element,
    relocate_element,
    unset_active_element,
    set_element_active,
    show_url_dialog,
    cancel
  },
  reducers: {
    init,
    reset,
    activated,    
    param_changed,
    form_data_changed,
    visual_element_changed
  }
} 