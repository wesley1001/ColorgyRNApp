import { combineReducers } from 'redux';

import colorgyAPI from './colorgyAPI';
import counter from './counter';

export default combineReducers({
  colorgyAPI,
  counter
});
