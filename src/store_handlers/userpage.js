const DEFAULT_STATE = {
  activeTab: 'users'
}
 
const init = () => {
  return DEFAULT_STATE;
}
 
const tab_changed = (state, activeTab) => {
  return {activeTab}
}
  
export default {
  actions: {

  },
  reducers: {
    init,
    tab_changed
  }
} 