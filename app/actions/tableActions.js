import { createAction } from 'redux-actions';
import colorgyAPI from '../utils/colorgyAPI';
import courseDatabase from '../databases/courseDatabase';

export const courseDatabaseLoad = createAction('COURSE_DATABASE_LOAD');
export const courseDatabaseLoading = createAction('COURSE_DATABASE_LOADING');

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
      });
    }
  }).catch((e) => {
    console.error(e);
  });
};

