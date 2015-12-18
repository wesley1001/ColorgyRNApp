import { createAction } from 'redux-actions';
import colorgyAPI from '../utils/colorgyAPI';

export const requestAccessToken = createAction('REQUEST_ACCESS_TOKEN');
export const clearAccessToken = createAction('CLEAR_ACCESS_TOKEN');
export const requestAccessTokenSuccess = createAction('REQUEST_ACCESS_TOKEN_SUCCESS');
export const requestAccessTokenFailed = createAction('REQUEST_ACCESS_TOKEN_FAILED');
export const refreshAccessToken = createAction('REFRESH_ACCESS_TOKEN');
export const refreshAccessTokenSuccess = createAction('REFRESH_ACCESS_TOKEN_SUCCESS');
export const refreshAccessTokenFailed = createAction('REFRESH_ACCESS_TOKEN_FAILED');

export const updateMe = createAction('UPDATE_ME');
export const updateMeSuccess = createAction('UPDATE_ME_SUCCESS');
export const updateMeFaild = createAction('UPDATE_ME_FAILD');

export const doRequestAccessToken = userCredentials => dispatch => {
  dispatch(requestAccessToken());

  let scopeString = 'public%20email%20account%20identity%20info%20write%20notifications%20notifications:send%20api%20api:write%20offline_access';

  return fetch(`${colorgyAPI.baseURL}/oauth/token?scope=${scopeString}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'password',
      username: userCredentials.username,
      password: userCredentials.password
    })
  }).then(req => req.json())
    .then(json => {
      if (json.access_token) {
        dispatch(requestAccessTokenSuccess(json));
        dispatch(doUpdateMe());
      } else {
        dispatch(requestAccessTokenFailed(json));
      }
    })
    .catch(reason => {
      dispatch(requestAccessTokenFailed({ error: 'request_error' }));
    });
};

export const doRefreshAccessToken = () => (dispatch, getState) => {
  dispatch(refreshAccessToken());

  var refreshToken = getState().colorgyAPI.refreshToken;

  return fetch(`${colorgyAPI.baseURL}/oauth/token`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  }).then(req => req.json())
    .then(json => {
      if (json.access_token) {
        dispatch(refreshAccessTokenSuccess(json));
      } else {
        dispatch(refreshAccessTokenFailed(json));
      }
  }).catch(reason => {
    dispatch(refreshAccessTokenFailed({ error: 'request_error' }));
  });
};

export const doClearAccessToken = userCredentials => dispatch => {
  dispatch(clearAccessToken());
};

export const doUpdateMe = () => (dispatch) => {
  dispatch(updateMe());

  colorgyAPI.fetch('/v1/me').then((r) => {
    if (r.status != 200) {
      dispatch(updateMeFaild(e));
      throw r;
    } else {
      return r.json();
    }
  }).then((json) => {
    var data = colorgyAPI.camelizeObject(json);
    dispatch(updateMeSuccess(data));
  }).catch((e) => {
    dispatch(updateMeFaild(e));
    console.error(e);
  });
};
