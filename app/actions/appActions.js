import { createAction } from 'redux-actions';
import store from '../store';
import { tableNavigateBack } from './tableActions';
import { boardNavigateBack } from './boardActions';
import { moreNavigateBack } from './moreActions';

export const backPress = createAction('BACK_PRESS');

export const doBackPress = () => (dispatch) => {
  dispatch(backPress());
  var currentState = store.getState();
  var currentAppTab = currentState && currentState.appTab && currentState.appTab.currentTab;

  switch (currentAppTab) {
    case 0:
      dispatch(tableNavigateBack());
      break;
    case 1:
      dispatch(boardNavigateBack());
      break;
    case 4:
      dispatch(moreNavigateBack());
      break;
  }
};

export const setOverlayElement = createAction('SET_OVERLAY_ELEMENT');
