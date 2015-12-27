import { createAction } from 'redux-actions';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';

export const courseDatabaseLoading = createAction('COURSE_DATABASE_LOADING');
export const courseDatabaseLoad = createAction('COURSE_DATABASE_LOAD');
export const courseDatabaseLoadFailed = createAction('COURSE_DATABASE_LOAD_FAILED');

/**
 * Load the course database for a specified organization, dispatch actions that
 * sets the states to represent the status of the database, and execute the
 * download or update if needed.
 *
 * @param {string} orgCode
 */
export const doLoadCourseDatabase = (orgCode) => (dispatch) => {
  dispatch(courseDatabaseLoading({ progress: null }));
  courseDatabase.getDataUpdatedTime(orgCode).then((updatedTime) => {

    // The database has been updated before
    if (updatedTime) {
      var obj = {};
      obj[orgCode] = updatedTime;
      dispatch(courseDatabaseLoad({ updatedTime: obj }));

      // TODO: check if the data is too old and do an update if the internet is accessible

    // No data has been downloaded yet, download it and dispatch the progress
    // on the way
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

/**
 * Update the course database for a specified organization.
 *
 * @param {string} orgCode
 */
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

/**
 * Load necessary data for course table into the store: current courses and
 * period data.
 *
 * @param {number} userId
 * @param {string} orgCode
 */
export const doLoadTableCourses = (userId, orgCode) => (dispatch) => {
  dispatch(loadTableCourse());

  courseDatabase.getPeriodData(orgCode, { returnObject: true }).then((periodData) => {
    tableDatabase.findCourses(userId, orgCode).then((courses) => {
      dispatch(tableCourseLoaded({ courses: courses, periodData: periodData }));
      // TODO: Maybe we can set the scheduled notifications here
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

/**
 * Add a selected course for the user.
 *
 * This will dispatch an action to update the state directly for fast UI
 * response, then do the actual work - insert the record into the database
 * and do a full reload.
 *
 * @param {object} course - a complete course object
 * @param {number} userId
 * @param {string} orgCode
 */
export const doAddCourse = (
  course, userId, orgCode,
  year = colorgyAPI.getCurrentYear(),
  term = colorgyAPI.getCurrentTerm()
) => (dispatch) => {
  dispatch(courseAdded({ course }));

  tableDatabase.addUserCourse(
    course.code, userId, orgCode, year, term
  ).then(() => {
    dispatch(doLoadTableCourses(userId, orgCode));
  }).catch((e) => {
    console.error(e);
  });
};

/**
 * Remove a selected course for the user.
 *
 * This will dispatch an action to update the state directly for fast UI
 * response, then do the actual work - delete the record from the database
 * and do a full reload.
 *
 * @param {object} course - a complete course object
 * @param {number} userId
 * @param {string} orgCode
 */
export const doRemoveCourse = (
  course, userId, orgCode,
  year = colorgyAPI.getCurrentYear(),
  term = colorgyAPI.getCurrentTerm()
) => (dispatch) => {
  dispatch(courseRemoved({ course }));

  tableDatabase.removeUserCourse(
    course.code, userId, orgCode, year, term
  ).then(() => {
    dispatch(doLoadTableCourses(userId, orgCode));
  }).catch((e) => {
    console.error(e);
  });
};

export const syncUserCourses = createAction('SYNC_USER_COURSES');
export const userCoursesSynced = createAction('USER_COURSES_SYNCED');
export const userCoursesSyncFailed = createAction('USER_COURSES_SYNC_FAILED');

/**
 * Sync the user's selected courses with the server, reload the data after
 * syncing.
 *
 * @param {number} userId
 * @param {string} orgCode
 */
export const doSyncUserCourses = (userId, orgCode, courseYear = colorgyAPI.getCurrentYear(), courseTerm = colorgyAPI.getCurrentTerm()) => (dispatch) => {
  dispatch(syncUserCourses());

  tableDatabase.syncUserCourses(userId, orgCode, courseYear, courseTerm).then(() => {
    dispatch(userCoursesSynced());
    dispatch(doLoadTableCourses(userId, orgCode));
  }).catch((e) => {
    console.error(e);
    dispatch(userCoursesSyncFailed(e));
  });
};

export const tableNavigateBack = createAction('TABLE_NAVIGATE_BACK');
