import { handleActions } from 'redux-actions';

export default handleActions({
  REQUEST_ACCESS_TOKEN: (state, action) => {
    return {
      ...state,
      hasAccessToken: false,
      refreshingAccessToken: true,
      accessToken: null,
      refreshToken: null,
      lastResponse: null
    };
  },

  REQUEST_ACCESS_TOKEN_SUCCESS: (state, action) => {
    return {
      ...state,
      hasAccessToken: true,
      refreshingAccessToken: false,
      accessToken: action.payload.access_token,
      refreshToken: action.payload.refresh_token,
      accessTokenExpiresAt: action.payload.created_at + action.payload.expires_in,
      lastResponse: action.payload
    };
  },

  REQUEST_ACCESS_TOKEN_FAILED: (state, action) => {
    return {
      ...state,
      hasAccessToken: false,
      refreshingAccessToken: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      lastResponse: action.payload
    };
  },

  REFRESH_ACCESS_TOKEN: (state, action) => {
    return {
      ...state,
      refreshingAccessToken: true
    };
  },

  REFRESH_ACCESS_TOKEN_SUCCESS: (state, action) => {
    return {
      ...state,
      hasAccessToken: true,
      refreshingAccessToken: false,
      accessToken: action.payload.access_token,
      refreshToken: action.payload.refresh_token,
      accessTokenExpiresAt: action.payload.created_at + action.payload.expires_in,
      lastResponse: action.payload
    };
  },

  REFRESH_ACCESS_TOKEN_FAILED: (state, action) => {
    return {
      ...state,
      refreshingAccessToken: false,
      lastResponse: action.payload
    };
  },

  CLEAR_ACCESS_TOKEN: (state, action) => {
    return {
      ...state,
      hasAccessToken: false,
      refreshingAccessToken: false,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      lastResponse: {}
    };
  }
}, {
  hasAccessToken: false,
  refreshingAccessToken: false,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  lastResponse: {}
});
