import ga from '../utils/ga';

const simpleLoggerMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  console.log('Redux Action', action.type, action.payload);

  return result;
};

export default simpleLoggerMiddleware;
