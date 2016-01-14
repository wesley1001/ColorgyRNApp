import { handleActions } from 'redux-actions';

export default handleActions({
  SELECT_TAB: (state, action) => {
    return {
      ...state,
      currentTab: action.payload.tab
    };
  },
  HIDE_APP_TAB_BAR: (state, action) => {
    return {
      ...state,
      hideAppTabBar: true
    };
  },
  SHOW_APP_TAB_BAR: (state, action) => {
    return {
      ...state,
      hideAppTabBar: false
    };
  }
}, { currentTab: 0 });
