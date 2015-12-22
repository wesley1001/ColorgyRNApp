import { handleActions } from 'redux-actions';

export default handleActions({
  COURSE_DATABASE_LOAD: (state, action) => {
    var courseDatabaseUpdatedTime = {
      ...state.courseDatabaseUpdatedTime,
      ...action.payload.updatedTime
    }
    return {
      ...state,
      courseDatabaseUpdatedTime: courseDatabaseUpdatedTime
    };
  },
  COURSE_DATABASE_LOADING: (state, action) => {
    return {
      ...state,
      courseDatabaseLoadingProgress: action.payload.progress
    };
  }
}, { courseDatabaseUpdatedTime: {} });
