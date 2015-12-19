import { handleActions } from 'redux-actions';

export default handleActions({
  GOT_UI_ENVIRONMENT: (state, action) => {
    var env = action.payload;
    return {
      ...state,
      ...env
    };
  }
}, {});
