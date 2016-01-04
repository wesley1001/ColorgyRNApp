/**
 * Colorgy API actions.
 *
 * Note that dealing with access tokens and sending requests with access token
 * may be useally done using utils/colorgyAPI.
 */

import { createAction } from 'redux-actions';
import store from '../store';
import colorgyAPI from '../utils/colorgyAPI';
import error from '../utils/errorHandler';

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

/**
 * Request an access token with specified user credentials, i.e. login.
 */
export const doRequestAccessToken = (userCredentials) => (dispatch) => {
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

/**
 * Refresh the access token.
 */
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
    error('colorgyAPIActions: refreshAccessTokenFailed: request_error', reason);
  });
};

/**
 * Get the latest access token, and pass it into a callback function.
 */
export const doGetAccessToken = (callback, forceRefresh, errorCallback) => (dispatch) => {
  var waitTimout = 0;

  var getAccessTokenFunction = () => {
    var colorgyAPIState = store.getState().colorgyAPI;
    var nowTime = (new Date()).getTime() / 1000;

    if (colorgyAPIState.hasAccessToken) {
      // If the access token is refreshing, wait until it is finished
      // TODO: check this in a more safe (blocking) way.
      if (colorgyAPIState.refreshingAccessToken) {
        console.log('colorgyAPIActions: Waiting for access token refresh to be done...');
        waitTimout++;

        if (waitTimout < 50) {
          setTimeout(() => { getAccessTokenFunction() }, 500);
        } else {
          error('colorgyAPIActions: Timeout while waiting for access token refresh');
          if (errorCallback) errorCallback();
        }

      // Proceed if the access token is not refreshing
      } else {

        // if the access token is going to expire
        if (colorgyAPIState.accessTokenExpiresAt - nowTime < 100 || forceRefresh) {
          forceRefresh = false;
          store.dispatch(doRefreshAccessToken());
          console.log('colorgyAPIActions: The access token is going to expire, refreshing...');
          setTimeout(() => { getAccessTokenFunction() }, 1000);

        // Just return the token
        } else {
          callback(colorgyAPIState.accessToken);
        }
      }

    } else {
      error('colorgyAPIActions: REQUESTING_ACCESS_TOKEN_WHILE_NO_ACCESS_TOKEN');
      if (errorCallback) errorCallback();
    }
  };

  getAccessTokenFunction();
};

/**
 * Clear the access token, i.e. logout.
 */
export const doClearAccessToken = () => (dispatch) => {
  dispatch(clearAccessToken());
};

/**
 * The vaild acess token has been lost while updating. Clear it.
 */
export const doAccessTokenLose = () => (dispatch) => {
  dispatch(doClearAccessToken());
  error('colorgyAPIActions: FATAL_ERROR: ACCESS_TOKEN_LOSE');
};

export const doUpdateMe = (updatedData) => (dispatch) => {
  dispatch(updateMe());

  if (!updatedData) {
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

  } else {
    console.log({ user: colorgyAPI.snakelizeObject(updatedData) });
    colorgyAPI.fetch('/v1/me', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: colorgyAPI.snakelizeObject(updatedData) })
    }).then((r) => {
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
  }
};
