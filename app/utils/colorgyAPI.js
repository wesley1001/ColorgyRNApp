import store from '../store';
import { doRequestAccessToken, doRefreshAccessToken, doClearAccessToken } from '../actions/colorgyAPIActions';

var colorgyAPI = {};

const baseURL = 'https://colorgy.io';

/**
 * Request a access token from the server, i.e.: login.
 *
 * @param {object} credentials Containing "username" and "password".
 */
function requestAccessToken(credentials) {
  store.dispatch(doRequestAccessToken(credentials));
}

/**
 * Get the access token (with automatically refresh), returns an
 * `Promise` object.
 *
 * @return {promise} With the access token input as a string on
 * success, or an error object if faild.
 */
function getAccessToken(forceRefresh = false) {
  var colorgyAPIState = store.getState().colorgyAPI;
  var nowTime = (new Date()).getTime() / 1000;

  return new Promise((resolve, reject) => {
    if (colorgyAPIState.hasAccessToken) {

      var getAccessTokenFunction = () => {
        // If the access token is refreshing, wait until it is finished
        if (colorgyAPIState.refreshingAccessToken) {
          console.log('colorgyAPI.getAccessToken: Waiting for refresh to done...');
          setTimeout(() => { getAccessTokenFunction(resolve, reject) }, 500);

        // Proceed if the access token is not refreshing
        } else {

          // if the access token is going to expire
          if (colorgyAPIState.accessTokenExpiresAt - nowTime < 100 || forceRefresh) {
            forceRefresh = false;
            store.dispatch(doRefreshAccessToken());
            console.log('colorgyAPI.getAccessToken: The access token is going to expire, refreshing...')
            setTimeout(() => { getAccessTokenFunction(resolve, reject) }, 500);

          // Just return the token
          } else {
            resolve(colorgyAPIState.accessToken);
          }
        }
      };

      getAccessTokenFunction();

    } else {
      reject('NO_ACCESS_TOKEN');
    }
  });
}

/**
 * A fetch warper to deal with access tokens automatically
 */
 function colorgyFetch(url, payload = {}) {
  var colorgyAPIState = store.getState().colorgyAPI;

  if (!url.match(/^http/)) {
    url = `${baseURL}/api${url}`;
  }

  if (colorgyAPIState.hasAccessToken) {
    return new Promise((resolve, reject) => {
      getAccessToken().then((accessToken) => {
        if (!payload.headers) payload.headers = {};
        payload.headers.Authorization = `Bearer ${accessToken}`;

        fetch(url, payload).then((r) => {
          if (r.status != 401) {
            resolve(r);

          // Try to refresh the access token if it has probably expired
          } else {
            getAccessToken().then((accessToken) => {
              payload.headers.Authorization = `Bearer ${accessToken}`;

              fetch(url, payload).then((r) => {
                if (r.status != 401) {
                  resolve(r);
                } else {
                  store.dispatch(doClearAccessToken());
                  reject(r);
                }
              });

            }).catch((e) => {
              reject(e);
            })
          }

        // Request error
        }).catch((e) => {
          reject(e);
        });

      // Access token error
      }).catch((e) => {
        fetch(url, payload).then(resolve).catch(reject);
      });
    });

  } else {
    return fetch(url, payload);
  }
}

/**
 * Clears the access token, i.e.: logout.
 */
function clearAccessToken() {
  store.dispatch(doClearAccessToken());
}

/**
 * Generates an uuid.
 *
 * @return {string} An random unique uuid.
 */
function generateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/**
 * Get the current semester year.
 *
 * @return {number}
 */
function getCurrentYear() {
  var date = (new Date());
  return ((date.getMonth() + 1 > 6) ? date.getFullYear() : date.getFullYear() - 1);
}

/**
 * Get the current semester term.
 *
 * @return {number}
 */
function getCurrentTerm() {
  var date = (new Date());
  return ((date.getMonth() + 1 > 6) ? 1 : 2);
}

colorgyAPI = {
  ...colorgyAPI,
  baseURL: baseURL,
  getAccessToken: getAccessToken,
  requestAccessToken: requestAccessToken,
  clearAccessToken: clearAccessToken,
  fetch: colorgyFetch,
  generateUUID: generateUUID,
  getCurrentYear: getCurrentYear,
  getCurrentTerm: getCurrentTerm
};

if (window) window.colorgyAPI = colorgyAPI;

export default colorgyAPI;
