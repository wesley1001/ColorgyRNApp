import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import reduxPersistExpectIngs from 'redux-persist-except-ings';
import createLogger from 'redux-logger';

import config from '../config';

import gaMiddleware from './middlewares/gaMiddleware';
import failureReportMiddleware from './middlewares/failureReportMiddleware';
import notifyMiddleware from './middlewares/notifyMiddleware';
import simpleLoggerMiddleware from './middlewares/simpleLoggerMiddleware';

var createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  gaMiddleware,
  failureReportMiddleware,
  notifyMiddleware
)(createStore);

if (__DEV__) {
  var loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
    predicate: (getState, action) => true
  });

  if (config.devLogger === 'simple') {
    loggerMiddleware = simpleLoggerMiddleware;
  }

  createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    gaMiddleware,
    failureReportMiddleware,
    notifyMiddleware,
    loggerMiddleware
  )(createStore);
}

let store = autoRehydrate()(createStoreWithMiddleware)(reducers);

persistStore(store, {
  storage: AsyncStorage,
  whitelist: ['deviceInfo', 'colorgyAPI', 'table', 'counter'],
  transforms: [reduxPersistExpectIngs]
});

if (window) window.store = store;

export default store;
