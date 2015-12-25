import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { createAction } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import reduxPersistExpectIngs from 'redux-persist-except-ings';
import createLogger from 'redux-logger';

import alertMiddleware from './middlewares/alertMiddleware';

var createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  alertMiddleware
)(createStore);

if (__DEV__) {
  const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
    predicate: (getState, action) => true
  });

  createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    alertMiddleware,
    loggerMiddleware
  )(createStore);
}

let store = autoRehydrate()(createStoreWithMiddleware)(reducers);

persistStore(store, {
  storage: AsyncStorage,
  whitelist: ['colorgyAPI', 'counter'],
  transforms: [reduxPersistExpectIngs]
});

if (window) window.store = store;

export default store;
