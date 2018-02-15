import StoreKeeper from '../utils/StoreKeeper';
import {START_Y, DEFAULT_SIZES} from '../consts/max_sizes';
import {DEFAULT_BRUSH_SIZE, DEFAULT_COLOR, DEFAULT_OPACITY} from '../consts/colors';
import {getScrollTop, getElementMarginLeft, getCenterCoords, generateKey} from '../utils';
import {get, post} from '../utils/Fetcher';
import {getUrls, stopEditTask} from '../utils/TaskResolver';
import {QUICKTASK_STORAGE_KEY, EDITED_TASK_STORAGE_KEY} from '../consts/storage';

const init = () => {
  return {
    status: 'active',
    formData: {},
    importance: 'usual',
    type: 'design',
    action: null,
    visualElements: {},
    currentElement: null,
    currentType: null,
    visualElement: null,
    markElement: null,
    selectionElement: null,
    taskInfoDict: null,
    info: {},
    bent: false,
    uiPanelShown: false,
    urlDialogData: null,
    dialogFetching: false,
    taskUsersDict: null,
    users: [],
    difficulty: 5,
    termsId: 7,
    until: 2,
    untilNum: ''
  }
}

const reset = (state, savedState) => {
  if (state.task_id && savedState) {
      return savedState;
  }
  state = init();
  state.urls = getUrls();
  return state;
}
 
const activated = (state, status) => {
  return {status}
}

const param_changed = (state, data) => {
  return data;
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

//===========================================

const change = ({dispatch}, data) => {
  dispatch('QUICKTASK_PARAM_CHANGED', data);
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
  if (typeof cut != 'undefined' || (typeof my != 'undefined' && d.cut)) {
    cutMask(id, cut, d, doAction);
  }
}

const cutMask = (id, cut, data, doAction) => {
  let {fixed} = data;
  let props = {id, cut};
  if (cut || data.cut) {
    let {width, height, mx, my} = data;
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
  let {currentElement} = state;
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
    status: 'collapsed',
    currentType,
    uiPanelShown: false
  });
}

const unset_active_element = ({doAction}) => {
   doAction('QUICKTASK_CHANGE_PARAM', {
    status: 'active',
    currentElement: null,
    visualElement: null
  });
}

const cancel = ({dispatch, doAction, state, getSavedState}) => {
  if (state.task_id) {
    stopEditTask();
    if (getSavedState('quicktask')) {    
     doAction('NOTIFICATIONS_ADD_SPECIAL', {messageFromDict: 'createmode'});
    }
  }
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

const save = ({dispatch, doAction, state}) => {
  post('save_task', {data: JSON.stringify(state)})
  .then(data => {
    doAction('QUICKTASK_CANCEL');
  });
}

const show_info_form = ({dispatch, state}) => {
  dispatch('QUICKTASK_PARAM_CHANGED', {dialogFetching: true});
  get('load_info_dialog', {type: state.type || ''})
    .then(({dict}) => {
      dispatch('QUICKTASK_PARAM_CHANGED', {
        dialogFetching: false,
        taskInfoDict: dict
      });
    });
}

const show_terms = ({dispatch, state}) => {
  dispatch('QUICKTASK_PARAM_CHANGED', {dialogFetching: true});
  get('load_task_terms')
    .then(({dict}) => {
      dispatch('QUICKTASK_PARAM_CHANGED', {
        dialogFetching: false,
        termsData: dict
      });
    });   
}

const show_users = ({dispatch, state}) => {
  dispatch('QUICKTASK_PARAM_CHANGED', {dialogFetching: true});
  let {type = '', action = ''} = state;
  get('load_task_users', {type, taskAction: action})
    .then(({dict}) => {
      let {users} = dict;
      let {execs} = state;
      if (!execs) {
        if (users.proper.length > 0) {
          execs = [];
          for (let u of users.proper) {
            execs.push(u.token);
          }
        }
      }
      dispatch('QUICKTASK_PARAM_CHANGED', {
        dialogFetching: false,
        taskUsersDict: dict,
        execs
      });
    });   
}

const load_until_date = ({dispatch}, value) => {
  get('load_until_date', {value})
    .then(({value}) => {
      dispatch('QUICKTASK_PARAM_CHANGED', {
        dialogFetching: false,
        untilTimeLeft: value
      });
    });
}

const load_edited_task = ({dispatch, doAction, state}, id) => {
  dispatch('MASK_CLEARED');
  doAction('NOTIFICATIONS_ADD_SPECIAL', {messageFromDict: 'editmode'});
  get('load_task', {id})
  .then(data => {
  let {visualElements} = data;
    if (visualElements instanceof Array) {
        data.visualElements = {};
    }
    dispatch('QUICKTASK_PARAM_CHANGED', data);
    if (visualElements instanceof Object) {
      for (let k in visualElements) {
        let {data} = visualElements[k];
        if (data.cut) {
          cutMask(k, true, data, doAction);
        }
      }
    }
  });
}

const assign_user = ({dispatch, state}, {token, assigned, role}) => {
  let key = role == 'exec' ? 'execs' : 'testers';
  let list = state[key] || [];
  if (!assigned) {
    let idx = list.indexOf(token);
    if (idx > -1) {
      list.splice(idx, 1);
    }
  } else {
    list.push(token);
  }
  dispatch('QUICKTASK_CHANGE', {[key]: list});
}

const editedTask = StoreKeeper.get(EDITED_TASK_STORAGE_KEY);
export default {
  localStore: {
    key: QUICKTASK_STORAGE_KEY,
    shouldLoad: () => {
      return !editedTask;
    },
    shouldSave: (state) => {
      return !editedTask;
    },
    shouldRemove: (state) => {
      return !editedTask && !state.status;
    },
    getInitialData: (defaultState, savedState) => {
      delete savedState.urlDialogData;
      return {
        ...defaultState,
        ...savedState 
      }
    },
    timeout: 500
  },
  actions: {
    add_element,
    change,
    change_param,
    change_visual_element,
    remove_element,
    relocate_element,
    unset_active_element,
    set_element_active,
    show_url_dialog,
    cancel,
    save,
    show_info_form,
    show_users,
    show_terms,
    load_until_date,
    load_edited_task,
    assign_user
  },
  reducers: {
    init,
    reset,
    activated,    
    param_changed,
    visual_element_changed
  }
} 