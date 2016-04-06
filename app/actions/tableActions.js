import React, { InteractionManager } from 'react-native';
import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import ga from '../utils/ga';
import error from '../utils/errorHandler';
import courseDatabase from '../databases/courseDatabase';
import tableDatabase from '../databases/tableDatabase';
import Notification from 'react-native-system-notification';

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

  if (orgCode === 'null') {
    dispatch(courseDatabaseLoad({ updatedTime: { 'null': (new Date()).getTime() } }));
    return;
  }

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
        error(e);
      });
    }
  }).catch((e) => {
    dispatch(courseDatabaseLoadFailed());
    error(e);
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
  var startedAt = (new Date()).getTime();

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
    ga.sendTiming('LocalDataUpdate', (new Date()).getTime() - startedAt, `UpdateCourseDatabase-${orgCode}`, `local-data-update,${orgCode}`);
  }).catch((e) => {
    dispatch(courseDatabaseUpdateFailed(e));
    error(e);
  });
};

export const doClearCourseDatabaseUpdateTime = createAction('COURSE_DATABASE_UPDATE_TIME_CLEAR');

export const doForceUpdateCourseDatabase = (orgCode) => (dispatch) => {
  dispatch(doClearCourseDatabaseUpdateTime(orgCode));
  dispatch(doUpdateCourseDatabase(orgCode));
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
      Notification.deleteAll().then(() => {
        var currentState = store.getState();
        var { notificationEnabled, notificationBeforeMinutes } = currentState.table;
        if (!notificationEnabled) return;

        for (var courseCode in courses) {
          var course = courses[courseCode];
          var name = course['name'];
          for (var i=1; i<10; i++) {
            var day = course['day_' + i];
            var periodCode = course['period_' + i];
            var loc = course['location_' + i];
            if (day == null || periodCode == null) break;
            var time = periodData[periodCode] && periodData[periodCode].time;
            if (time == null) break;
            var ts = time.split(/[:-]/);
            var hour = parseInt(ts[0]);
            var minute = parseInt(ts[1]);
            d = new Date();
            d.setSeconds(0);
            d.setHours(hour);
            d.setMinutes(minute);
            var currentDay = d.getDay();
            var dayDistance = day - currentDay;
            d.setDate(d.getDate() + dayDistance);
            d.setTime(d.getTime() - notificationBeforeMinutes * 60 * 1000);

            Notification.create({
              subject: '上課提醒',
              message: `${time} 在 ${loc} 上 ${name} 喔！`,
              sendAt: d,
              repeatEvery: 'week',
              count: 18
            });
          }
        }
      }).catch((e) => {
        error(e);
      });
    }).catch((e) => {
      error(e);
      dispatch(loadTableCourseFailed(e));
    });

  }).catch((e) => {
    error(e);
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
  term = colorgyAPI.getCurrentTerm(),
  successCallback, errorCallback
) => (dispatch) => {
  dispatch(courseAdded({ course }));


  InteractionManager.runAfterInteractions(() => {
    tableDatabase.addUserCourse(
      course.code, userId, orgCode, year, term
    ).then(() => {
      dispatch(doLoadTableCourses(userId, orgCode));
      if (successCallback) successCallback();
    }).catch((e) => {
      error(e);
      if (errorCallback) errorCallback();
    });
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

  InteractionManager.runAfterInteractions(() => {
    tableDatabase.removeUserCourse(
      course.code, userId, orgCode, year, term
    ).then(() => {
      dispatch(doLoadTableCourses(userId, orgCode));
    }).catch((e) => {
      error(e);
    });
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
  if (store.getState().table.userCourseSyncing) return;

  dispatch(syncUserCourses());
  var startedAt = (new Date()).getTime();

  tableDatabase.syncUserCourses(userId, orgCode, courseYear, courseTerm).then(() => {
    dispatch(userCoursesSynced());
    dispatch(doLoadTableCourses(userId, orgCode));
    ga.sendTiming('LocalDataSync', (new Date()).getTime() - startedAt, `SyncUserCourses`, `local-data-sync`);
  }).catch((e) => {
    dispatch(userCoursesSyncFailed(e));
    error(e);
  });
};

export const tableNavigateBack = createAction('TABLE_NAVIGATE_BACK');

/**
 * Create a custom course.
 */
// export const doCreateCourse = (orgCode, courseYear, courseTerm, course) => (dispatch) => {
//   tableDatabase.createCourse(orgCode, courseYear, courseTerm, course);
// };

/**
 * Create and add a custom course.
 */
export const doCreateAndAddCourse = (userId, orgCode, course, successCallback, errorCallback) => (dispatch) => {
  courseDatabase.createCourse(orgCode, course).then((course) => {
    dispatch(doAddCourse(course, userId, orgCode, course.year, course.term, successCallback, errorCallback));
  }).catch((e) => {
    if (errorCallback) errorCallback(e);
  });
};
