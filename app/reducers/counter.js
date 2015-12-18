import { handleActions } from 'redux-actions';

export default handleActions({
  COUNTER_PLUS: (state, action) => {
    return {
      count: state.count + 1
    };
  }
}, { count: 0 });
