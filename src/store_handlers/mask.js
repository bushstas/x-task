import StoreKeeper from '../utils/StoreKeeper';

const STORAGE_KEY = 'mask';
let savedState = StoreKeeper.get(STORAGE_KEY);

let timeout;
const onStateChanged = (state) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    StoreKeeper.set(STORAGE_KEY, state);
  }, 1000);
}

const DEFAULT_STATE = {
	maskShown: false,
	maskOpacity: 0.7,
	cuts: {}
}

let defaultState = savedState || DEFAULT_STATE;
 
const init = () => {
	return defaultState;
}
 
const param_changed = (state, props) => {
 	return props;
}

const cut_added = (state, props) => {
	let {cuts} = state;
	cuts[props.id] = props;
	return {cuts};
}

const cut_removed = (state, props) => {
	let {cuts} = state;
	delete cuts[props.id];
	return {cuts};
}

const toggle_param = ({dispatch, state}, name) => {
	dispatch('MASK_PARAM_CHANGED', {[name]: !state[name]});
}

const cut_mask = ({dispatch, state}, data) => {
	let {cut} = data;
	if (typeof cut != 'boolean' || cut) {
		let {width, height, x, y, id} = data;
		dispatch('MASK_CUT_ADDED', data);
	} else {
		dispatch('MASK_CUT_REMOVED', data);
	}
}
  
export default {
	onStateChanged,
	actions: {
		toggle_param,
		cut_mask
	},
	reducers: {
		init,
		param_changed,
		cut_added,
		cut_removed
  	}
} 