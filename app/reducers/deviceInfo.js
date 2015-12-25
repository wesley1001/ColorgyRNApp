import { handleActions } from 'redux-actions';

export default handleActions({
  GOT_DEVICE_INFO: (state, action) => {
    var info = action.payload;
    return {
      ...state,
      ...info
    };
  }
}, {});
