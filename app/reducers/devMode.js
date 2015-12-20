import { handleActions } from 'redux-actions';

export default handleActions({
  ENTER_DEV_MODE: (state, action) => {
    return {
      devMode: true,
      enterPress: 0
    };
  },
  EXIT_DEV_MODE: (state, action) => {
    return {
      devMode: false,
      enterPress: 0
    };
  },
  ENTER_DEV_MODE_PRESS: (state, action) => {
    return {
      enterPress: state.enterPress + 1
    };
  },
  RESET_ENTER_DEV_MODE_PRESS: (state, action) => {
    return {
      enterPress: 0
    };
  }
}, { enterPress: 0 });
