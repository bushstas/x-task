const DEFAULT_STATE = {
  active: false,
  formData: {},
  importance: 'usual',
  type: null,
  action: null
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
  
export default {
  actions: {

  },
  reducers: {
    init,
    activated,
    importance_changed,
    type_changed,
    action_changed,
    form_data_changed
  }
} 