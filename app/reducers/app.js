import { handleActions } from 'redux-actions';

export default handleActions({
  'persist/COMPLETE': (state, action) => {
    return {
      ...state,
      stateReady: true
    };
  },
  SET_OVERLAY_ELEMENT: (state, action) => {
    return {
      ...state,
      overlayElement: action.payload
    };
  },
}, { stateReady: false });
