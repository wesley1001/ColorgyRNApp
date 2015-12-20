import { combineReducers } from 'redux';

import colorgyAPI from './colorgyAPI';
import appTab from './appTab';
import uiEnvironment from './uiEnvironment';
import devMode from './devMode';
import counter from './counter';

export default combineReducers({
  colorgyAPI,
  appTab,
  uiEnvironment,
  devMode,
  counter
});
