import { createAction } from 'redux-actions';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';

export const courseDatabaseLoading = createAction('COURSE_DATABASE_LOADING');
export const courseDatabaseLoad = createAction('COURSE_DATABASE_LOAD');
export const courseDatabaseLoadFailed = createAction('COURSE_DATABASE_LOAD_FAILED');

export const doLoadCourseDatabase = (orgCode) => (dispatch) => {
  dispatch(courseDatabaseLoading({ progress: null }));
  courseDatabase.getDataUpdatedTime(orgCode).then((updatedTime) => {

    if (updatedTime) {
      var obj = {};
      obj[orgCode] = updatedTime;
      dispatch(courseDatabaseLoad({ updatedTime: obj }));
    } else {
      courseDatabase.updateData(
        orgCode,
        colorgyAPI.getCurrentYear(),
        colorgyAPI.getCurrentTerm(),
        (progress) => {
          dispatch(courseDatabaseLoading({ progress }));
        }
      ).then((updatedTime) => {
        var obj = {};
        obj[orgCode] = updatedTime;
        dispatch(courseDatabaseLoad({ updatedTime: obj }));
      }).catch((e) => {
        dispatch(courseDatabaseLoadFailed());
        console.error(e);
      });
    }
  }).catch((e) => {
    dispatch(courseDatabaseLoadFailed());
    console.error(e);
  });
};

export const courseDatabaseUpdating = createAction('COURSE_DATABASE_UPDATING');
export const courseDatabaseUpdated = createAction('COURSE_DATABASE_UPDATED');
export const courseDatabaseUpdateFailed = createAction('COURSE_DATABASE_UPDATE_FAILED');

export const doUpdateCourseDatabase = (orgCode) => (dispatch) => {
  dispatch(courseDatabaseUpdating({ progress: null }));

  courseDatabase.updateData(
    orgCode,
    colorgyAPI.getCurrentYear(),
    colorgyAPI.getCurrentTerm(),
    (progress) => {
      dispatch(courseDatabaseUpdating({ progress }));
    }
  ).then((updatedTime) => {
    var obj = {};
    obj[orgCode] = updatedTime;
    dispatch(courseDatabaseUpdated({ updatedTime: obj }));
  }).catch((e) => {
    dispatch(courseDatabaseUpdateFailed());
    console.error(e);
  });
};

export const loadTableCourse = createAction('LOAD_TABLE_COURSES');
export const tableCourseLoaded = createAction('TABLE_COURSES_LOADED');
export const loadTableCourseFailed = createAction('LOAD_TABLE_COURSES_FAILED');

export const doLoadTableCourses = (userID, orgCode) => (dispatch) => {
  dispatch(loadTableCourse());

  courseDatabase.getPeriodData(userID, orgCode).then((periodData) => {
    tableDatabase.findCourses(userID, orgCode).then((courses) => {
      dispatch(tableCourseLoaded({ courses: courses, periodData: periodData }));
    }).catch((e) => {
      console.error(e);
      dispatch(loadTableCourseFailed(e));
    });

  }).catch((e) => {
    console.error(e);
    dispatch(loadTableCourseFailed(e));
  });
};

export const courseAdded = createAction('COURSE_ADDED');
export const courseRemoved = createAction('COURSE_REMOVED');

export const doAddCourse = (
  course, userID, orgCode,
  year = colorgyAPI.getCurrentYear(),
  term = colorgyAPI.getCurrentTerm()
) => (dispatch) => {
  dispatch(courseAdded({ course }));

  tableDatabase.addUserCourse(
    course.code, userID, orgCode, year, term
  ).then(() => {
    dispatch(doLoadTableCourses());
  }).catch((e) => {
    console.error(e);
  });
};

export const doRemoveCourse = (
  course, userID, orgCode,
  year = colorgyAPI.getCurrentYear(),
  term = colorgyAPI.getCurrentTerm()
) => (dispatch) => {
  dispatch(courseRemoved({ course }));

  tableDatabase.removeUserCourse(
    course.code, userID, orgCode, year, term
  ).then(() => {
    dispatch(doLoadTableCourses());
  }).catch((e) => {
    console.error(e);
  });
};

export const searchCourse = createAction('SEARCH_COURSE');
export const courseSearchResultReceived = createAction('COURSE_SEARCH_RESULT_RECEIVED');

export const doSearchCourse = (query) => (dispatch) => {
  dispatch(searchCourse(query));

  courseDatabase.searchCourse(query).then((courses) => {
    dispatch(courseSearchResultReceived(courses));
  }).catch((e) => {
    console.error(e);
  });
};

export const syncUserCourses = createAction('SYNC_USER_COURSES');
export const userCoursesSynced = createAction('USER_COURSES_SYNCED');
export const userCoursesSyncFailed = createAction('USER_COURSES_SYNC_FAILED');

export const doSyncUserCourses = (userID, orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => (dispatch) => {
  dispatch(syncUserCourses());

  tableDatabase.syncUserCourses(userID, orgCode, courseYear, courseTerm).then(() => {
    dispatch(userCoursesSynced());
    dispatch(doLoadTableCourses(userID, orgCode));
  }).catch((e) => {
    console.error(e);
    dispatch(userCoursesSyncFailed(e));
  });
};
