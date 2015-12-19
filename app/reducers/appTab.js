import { handleActions } from 'redux-actions';

export default handleActions({
  SELECT_TAB: (state, action) => {
    return {
      currentTab: action.payload
    };
  }
}, { currentTab: 0 });
