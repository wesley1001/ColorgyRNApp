import { handleActions } from 'redux-actions';

export default handleActions({
  COURSE_DATABASE_LOADING: (state, action) => {
    return {
      ...state,
      courseDatabaseLoadingProgress: action.payload.progress,
      courseDatabaseStatus: 'loading'
    };
  },
  COURSE_DATABASE_LOAD: (state, action) => {
    var courseDatabaseUpdatedTime = {
      ...state.courseDatabaseUpdatedTime,
      ...action.payload.updatedTime
    }
    return {
      ...state,
      courseDatabaseUpdatedTime: courseDatabaseUpdatedTime,
      courseDatabaseStatus: 'ready'
    };
  },
  COURSE_DATABASE_LOAD_FAILED: (state, action) => {
    return {
      ...state,
      courseDatabaseStatus: 'failed'
    };
  },
  COURSE_DATABASE_UPDATING: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdatingProgress: action.payload.progress,
      courseDatabaseStatus: 'updating'
    };
  },
  COURSE_DATABASE_UPDATED: (state, action) => {
    var courseDatabaseUpdatedTime = {
      ...state.courseDatabaseUpdatedTime,
      ...action.payload.updatedTime
    }
    return {
      ...state,
      courseDatabaseUpdatedTime: courseDatabaseUpdatedTime,
      courseDatabaseStatus: 'ready'
    };
  },
  COURSE_DATABASE_UPDATE_FAILED: (state, action) => {
    return {
      ...state
    };
  },

  LOAD_TABLE_COURSES: (state, action) => {
    return {
      ...state,
      tableStatus: 'loading'
    };
  },
  TABLE_COURSES_LOADED: (state, action) => {
    return {
      ...state,
      tableCourses: action.payload.courses,
      tablePeriodData: action.payload.periodData,
      tableStatus: 'ready'
    };
  },
  LOAD_TABLE_COURSES_FAILED: (state, action) => {
    return {
      ...state,
      tableStatus: 'failed'
    };
  },

  COURSE_ADDED: (state, action) => {
    var tableCourses = state.tableCourses;
    tableCourses[action.payload.course.code] = action.payload.course;

    return {
      ...state,
      tableCourses: tableCourses
    };
  },
  COURSE_REMOVED: (state, action) => {
    var tableCourses = state.tableCourses;
    delete tableCourses[action.payload.course.code];

    return {
      ...state,
      tableCourses: tableCourses
    };
  },

  SYNC_USER_COURSES: (state, action) => {
    return {
      ...state
    };
  },
  USER_COURSES_SYNCED: (state, action) => {
    return {
      ...state
    };
  },
  USER_COURSES_SYNC_FAILD: (state, action) => {
    return {
      ...state
    };
  }
}, {
  courseDatabaseUpdatedTime: {},
  courseDatabaseStatus: null,
  tableStatus: 'new'
});
