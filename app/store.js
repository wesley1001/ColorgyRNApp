import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => true
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

let store = autoRehydrate()(createStoreWithMiddleware)(reducers);

persistStore(store, {
  storage: AsyncStorage,
  whitelist: ['counter']
});

export default store;
