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
      lastResponse: {},
      me: {},
      meUpdatedAt: null,
    };
  },

  GOT_DEVICE_UNIQUE_ID: (state, action) => {
    return {
      ...state,
      deviceUniqueID: action.payload.deviceUniqueID
    };
  },

  GOT_DEVICE_NAME: (state, action) => {
    return {
      ...state,
      deviceName: action.payload.deviceName
    };
  },

  GCM_REGISTERED: (state, action) => {
    return {
      ...state,
      gcmDeviceToken: action.payload.deviceToken
    };
  },

  UPDATE_ME: (state, action) => {
    return {
      ...state,
      meUpdating: true
    };
  },

  UPDATE_ME_SUCCESS: (state, action) => {
    return {
      ...state,
      me: action.payload,
      meUpdatedAt: action.payload.updatedAt,
      meUpdating: false
    };
  },

  UPDATE_ME_FAILD: (state, action) => {
    return {
      ...state,
      meUpdating: false
    };
  },

  ORG_AVAILABLE: (state, action) => {
    return {
      ...state,
      orgAvailable: true
    };
  },

  ORG_NOT_AVAILABLE: (state, action) => {
    return {
      ...state,
      orgAvailable: false
    };
  }
}, {
  hasAccessToken: false,
  refreshingAccessToken: false,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  lastResponse: {},
  me: {},
  meUpdatedAt: null,
  orgAvailable: false
});
