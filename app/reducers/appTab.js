import { handleActions } from 'redux-actions';

export default handleActions({
  SELECT_TAB: (state, action) => {
    if (state.currentTab === action.payload.tab) {
      var rePressCountOnTab = state.rePressCountOnTab;
      rePressCountOnTab[state.currentTab] = (rePressCountOnTab[state.currentTab] || 0) + 1;
      return {
        ...state,
        rePressCountOnTab
      };
    } else {
      return {
        ...state,
        currentTab: action.payload.tab
      };
    }
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
}, { currentTab: 0, rePressCountOnTab: {} });
