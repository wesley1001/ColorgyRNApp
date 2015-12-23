import { handleActions } from 'redux-actions';

export default handleActions({
  'persist/COMPLETE': (state, action) => {
    return {
      stateReady: true
    };
  }
}, { stateReady: false });
