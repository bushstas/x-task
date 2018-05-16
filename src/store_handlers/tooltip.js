import {get} from '../utils/Fetcher';
 
const DEFAULT_STATE = {
  tooltips: {},
  tooltipFetching: false,
  tooltip: null
}
 
/**
 ===============
 Reducers
 ===============
*/
 
const init = () => {
  return DEFAULT_STATE;
}

const fetching = (state) => {
  return {tooltipFetching: true}
}

const closed = () => {
  return {tooltip: null}
}

const shown = (state, tooltip) => {
  return {tooltip}
}

const loaded = (state, {data, name}) => {
  let {tooltips} = state;
  tooltips = {
    ...tooltips,
    ...data
  }
  return {
    tooltips,
    tooltip: data[name],
    tooltipFetching: false
  }
}
 
/**
 ===============
 Actions
 ===============
*/

const load = ({dispatch}, name) => {
  dispatch('TOOLTIP_FETCHING');
  get('tooltip', {name})
  .then((data) => {
    dispatch('TOOLTIP_LOADED', {data: data.tooltip, name});
  });
}

const show = ({doAction, dispatch, state}, name) => {
  let {tooltips} = state;
  if (typeof tooltips[name] == 'string') {
    dispatch('TOOLTIP_SHOWN', tooltips[name]);
  } else {
    doAction('TOOLTIP_LOAD', name);
  }
}

 
export default {
  actions: {
    load,
    show
  },
  reducers: {
    init,
    fetching,
    loaded,
    shown,
    closed
  }
} 