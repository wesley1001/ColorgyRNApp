import { createAction } from 'redux-actions';
import store from '../store';

export const enterDevMode = createAction('ENTER_DEV_MODE');
export const exitDevMode = createAction('EXIT_DEV_MODE');
export const enterDevModePress = createAction('ENTER_DEV_MODE_PRESS');

export const doEnterDevModePress = () => dispatch => {
  dispatch(enterDevModePress());
  if (store.getState().devMode.enterPress > 10) dispatch(enterDevMode());
};
