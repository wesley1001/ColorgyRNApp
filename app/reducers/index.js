import { combineReducers } from 'redux';

import app from './app';
import colorgyAPI from './colorgyAPI';
import appTab from './appTab';
import deviceInfo from './deviceInfo';
import table from './table';
import devMode from './devMode';
import counter from './counter';

export default combineReducers({
  app,
  colorgyAPI,
  appTab,
  deviceInfo,
  table,
  devMode,
  counter
});
