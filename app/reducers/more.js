import { handleActions } from 'redux-actions';
import LOADING_STATE from '../constants/LOADING_STATE';

const defaultState = {
};

export default handleActions({
  MORE_NAVIGATE_BACK: (state, action) => {
    var navigateBackCount = state.navigateBackCount || 0;
    navigateBackCount++;

    return {
      ...state,
      navigateBackCount
    };
  }
}, defaultState);
