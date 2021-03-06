import {get} from '../utils/Fetcher';

const init = () => {
  return {
    value: ''
  }
}

const change = ({setState}, value) => {
  setState({value});
}

const check_task = ({and, doAction, state, setState}) => {
  const idn = state.value;
  if (idn) {
    setState({notFound: false});
    get('task_get_id', {idn})
    .then(props => {
      setState({value: ''});
      if (props.id) {
        doAction('MODALS_HIDE', 'quick_call');
        doAction('TASKINFO_CHANGE', props);
        doAction('MODALS_SHOW', {name: 'task_info', props});
      } else {
        and('SHOW_ERROR');
      }
    });
  }
}

const show_error = ({setState}) => {
  setState({notFound: true});
}

export default {
  actions: {
  	check_task,
    show_error,
    change
  },
  reducers: {
    init
  }
} 