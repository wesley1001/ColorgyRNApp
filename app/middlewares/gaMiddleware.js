import ga from '../utils/ga';

const gaMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  ga.sendEvent('action', action.type, action.type, JSON.stringify(action.payload))

  return result;
};

export default gaMiddleware;
