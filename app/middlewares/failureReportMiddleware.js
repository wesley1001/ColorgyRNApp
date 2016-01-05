import error from '../utils/errorHandler';

const failureReportMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  if (action.type && action.type.match && action.type.match('FAIL')) {
    error('ActionError: ', action.type, action);
  }

  return result;
};

export default failureReportMiddleware;
