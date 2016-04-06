import ga from './ga';

const errorHandler = function (...args) {
  console.error(...args);
  ga.sendException(JSON.stringify(args));
};

export default errorHandler;
