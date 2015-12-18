import { createAction } from 'redux-actions';

export const counterPlus = createAction('COUNTER_PLUS');

export const asyncCounterPlus = (delay = 2000) => dispatch => {
  setTimeout(() => { dispatch(counterPlus()); }, delay);
};
