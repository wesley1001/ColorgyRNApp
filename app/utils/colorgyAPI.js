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
  return new Promise((resolve, reject) => {

    var getAccessTokenFunction = () => {
      var colorgyAPIState = store.getState().colorgyAPI;
      var nowTime = (new Date()).getTime() / 1000;

      if (colorgyAPIState.hasAccessToken) {
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

      } else {
        reject('NO_ACCESS_TOKEN');
      }
    };

    getAccessTokenFunction();
  });
}

/**
 * Clears the access token, i.e.: logout.
 */
function clearAccessToken() {
  store.dispatch(doClearAccessToken());
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
 * Camelize a string.
 *
 * @param {string} an snake_case, kebab-case or any other string to be camelized.
 * @return {string} The camelized string.
 */
function camelize(str) {
  return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}

/**
 * Camelize a object.
 *
 * @param {object} an object using snake_case or kebab-case keys to be camelized.
 * @return {object} The camelized object.
 */
function camelizeObject(obj) {
  var camelizedObj = Object.assign({}, obj);

  for (var prop in camelizedObj) {
    var camelizedProp = camelize(prop);
    if (camelizedProp != prop) {
      camelizedObj[camelizedProp] = camelizedObj[prop];
      delete camelizedObj[prop];
    }
  }

  return camelizedObj;
}

/**
 * Snakelize a string.
 *
 * @param {string} an camelCase string to be snakelize.
 * @return {string} The snakelize string.
 */
function snakelize(str) {
  return str.replace(/([A-Z])/g, function(match, w, offset) {
    if (offset == 0) return w.toLowerCase();
    else return '_' + w.toLowerCase();
  });
}

/**
 * Snakelize a object.
 *
 * @param {object} an object using camelCase keys to be snakelize.
 * @return {object} The snakelized object.
 */
function snakelizeObject(obj) {
  var snakelizedObj = Object.assign({}, obj);

  for (var prop in snakelizedObj) {
    var snakelizedProp = snakelize(prop);
    if (snakelizedProp != prop) {
      snakelizedObj[snakelizedProp] = snakelizedObj[prop];
      delete snakelizedObj[prop];
    }
  }

  return snakelizedObj;
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
  var month = date.getMonth() + 1;

  if (month > 6) {
    return date.getFullYear();
  } else if (month < 2) {
    return date.getFullYear() - 1;
  } else {
    return date.getFullYear() - 1;
  }
}

/**
 * Get the current semester term.
 *
 * @return {number}
 */
function getCurrentTerm() {
  var date = (new Date());
  var month = date.getMonth() + 1;

  if (month > 6) {
    return 1;
  } else if (month < 2) {
    return 1;
  } else {
    return 2;
  }
}

colorgyAPI = {
  ...colorgyAPI,
  baseURL: baseURL,
  getAccessToken: getAccessToken,
  requestAccessToken: requestAccessToken,
  clearAccessToken: clearAccessToken,
  fetch: colorgyFetch,
  camelize: camelize,
  camelizeObject: camelizeObject,
  snakelize: snakelize,
  snakelizeObject: snakelizeObject,
  generateUUID: generateUUID,
  getCurrentYear: getCurrentYear,
  getCurrentTerm: getCurrentTerm
};

if (window) window.colorgyAPI = colorgyAPI;

export default colorgyAPI;
