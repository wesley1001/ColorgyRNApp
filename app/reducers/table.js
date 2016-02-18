import { handleActions } from 'redux-actions';
import LOADING_STATE from '../constants/LOADING_STATE';

const defaultState = {
  // The last courses update time of each organization in the course database
  // e.g.: `{ NTUST: 1451152095378 }`
  courseDatabaseUpdatedTime: {},
  // Loading status of the course database
  courseDatabaseLoading: LOADING_STATE.PENDING,
  // Loading status of the table data (from the local database)
  tableLoading: LOADING_STATE.PENDING,
  // Courses of the current year & term to display on the table
  tableCourses: {}
};

export default handleActions({
  // Database related actions
  COURSE_DATABASE_LOADING: (state, action) => {
    return {
      ...state,
      courseDatabaseLoadingProgress: action.payload.progress,
      courseDatabaseLoading: LOADING_STATE.LOADING
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
      courseDatabaseLoading: LOADING_STATE.DONE
    };
  },
  COURSE_DATABASE_LOAD_FAILED: (state, action) => {
    return {
      ...state,
      courseDatabaseLoading: LOADING_STATE.ERROR
    };
  },
  COURSE_DATABASE_UPDATING: (state, action) => {
    return {
      ...state,
      courseDatabaseUpdatingProgress: action.payload.progress
    };
  },
  COURSE_DATABASE_UPDATED: (state, action) => {
    var courseDatabaseUpdatedTime = {
      ...state.courseDatabaseUpdatedTime,
      ...action.payload.updatedTime
    }
    return {
      ...state,
      courseDatabaseUpdatedTime: courseDatabaseUpdatedTime
    };
  },
  COURSE_DATABASE_UPDATE_FAILED: (state, action) => {
    return {
      ...state
    };
  },
  COURSE_DATABASE_UPDATE_TIME_CLEAR: (state, action) => {
    var courseDatabaseUpdatedTime = {
      ...state.courseDatabaseUpdatedTime
    }

    courseDatabaseUpdatedTime[action.payload] = null;

    return {
      ...state,
      courseDatabaseUpdatedTime: courseDatabaseUpdatedTime
    };

  },

  // Table loading actions
  LOAD_TABLE_COURSES: (state, action) => {
    return {
      ...state,
      tableLoading: LOADING_STATE.LOADING
    };
  },
  TABLE_COURSES_LOADED: (state, action) => {
    return {
      ...state,
      tableCourses: action.payload.courses,
      tablePeriodData: action.payload.periodData,
      tableLoading: LOADING_STATE.DONE
    };
  },
  LOAD_TABLE_COURSES_FAILED: (state, action) => {
    return {
      ...state,
      tableLoading: LOADING_STATE.ERROR
    };
  },
  TABLE_COURSES_TIME_INDEXED: (state, action) => {
    return {
      ...state,
      tableCoursesTimeIndex: action.payload.index
    };
  },

  // Course managing actions
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

  // Syncing actions
  SYNC_USER_COURSES: (state, action) => {
    return {
      ...state,
      userCourseSyncing: true
    };
  },
  USER_COURSES_SYNCED: (state, action) => {
    return {
      ...state,
      userCourseSyncing: false
    };
  },
  USER_COURSES_SYNC_FAILD: (state, action) => {
    return {
      ...state,
      userCourseSyncing: false
    };
  },

  TABLE_NAVIGATE_BACK: (state, action) => {
    var navigateBackCount = state.navigateBackCount || 0;
    navigateBackCount++;

    return {
      ...state,
      navigateBackCount
    };
  },
}, defaultState);
