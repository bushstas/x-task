import {get, post} from '../utils/Fetcher';

const change = ({setState}, data) => {
  setState(data);
}

const load = ({setState}, data) => {
  get('load_work_status').then(setState);
}

const save = (store, data) => {
  post('save_work_status', data);
}

export default {
  actions: {
    change,
    load,
    save
  },
  reducers: {}
} 