import {MASK_STORAGE_KEY} from '../consts/storage';

const getCoords = (data) => {
	let {mx, my, width, height, fixed, id} = data;
	let x = document.body.clientWidth / 2 + mx,
		y = my,
		x2 = x + width,
		y2 = y + height;
	return {x, y, x2, y2, mx, my, width, fixed, height, id};
}

const init = () => {
	return {
		maskShown: false,
		maskOpacity: 0.7,
		cuts: {},
		added: null,
		removed: null
	};
}
 
const param_changed = (state, props) => {
 	return {
 		...props,
 		removed: null,
 		added: null
 	};
}

const cleared = () => {
	return {
		cuts: {},
		cleared: true,
		removed: null,
 		added: null
	}
}

const cut_added = (state, props) => {
	props = getCoords(props);
	let {cuts, layers, id} = state;
	let removed = null;
	if (cuts[props.id]) {
		removed = [cuts[props.id]];
	}
	cuts[props.id] = props;
	let added = [props];
	let keys = Object.keys(cuts);
	if (keys.length > 1 && (!layers || !id)) {
		let {x, y, x2, y2} = props;
		for (let k in cuts) {
			if (k != props.id) {
				let c = cuts[k];
				if (!(x2 < c.x || c.x2 < x || y2 < c.y || c.y2 < y)) {
					added.push(c);
				}
			}
		}
	}
	return {cuts, added, removed};
}

const cut_removed = (state, props) => {
	let {cuts} = state;
	delete cuts[props.id];
	return {cuts};
}

const resized = (state) => {
	let {cuts} = state;
	let newCuts = {};
	for (let k in cuts) {		
		newCuts[k] = getCoords(cuts[k]);
	}
	return {cuts: newCuts};
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

const change = ({dispatch}, data) => {
	dispatch('MASK_PARAM_CHANGED', data);
}

 
export default {
	localStore: {
	    key: MASK_STORAGE_KEY,
	    getData: (state) => {
			delete state.added;
  			delete state.removed;
  			return state;
	    },
	    timeout: 1000
	},
	actions: {
		toggle_param,
		cut_mask,
		change
	},
	reducers: {
		init,
		param_changed,
		cut_added,
		cut_removed,
		cleared,
		resized
  	}
} 