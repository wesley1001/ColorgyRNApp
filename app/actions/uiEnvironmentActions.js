import React, { NativeModules, PixelRatio } from 'react-native';
import { createAction } from 'redux-actions';

export const gotUIEnvironment = createAction('GOT_UI_ENVIRONMENT');

export const doGetUIEnvironment = () => dispatch => {
  if (NativeModules.SystemWindowAndroid) {
    NativeModules.SystemWindowAndroid.isTranslucentStatusBar((e) => {
      console.error('doGetUIEnvironment error', e);
    }, (translucentStatusBar) => {
      dispatch(gotUIEnvironment({ translucentStatusBar: translucentStatusBar }));
    });

    NativeModules.SystemWindowAndroid.isTranslucentActionBar((e) => {
      console.error('doGetUIEnvironment error', e);
    }, (translucentActionBar) => {
      dispatch(gotUIEnvironment({ translucentActionBar: translucentActionBar }));
    });

    NativeModules.SystemWindowAndroid.getStatusBarHeight((e) => {
      console.error('doGetUIEnvironment error', e);
    }, (statusBarHeight) => {
      dispatch(gotUIEnvironment({ statusBarHeight: statusBarHeight / PixelRatio.get() + 5 }));
    });

    NativeModules.SystemWindowAndroid.getActionBarHeight((e) => {
      console.error('doGetUIEnvironment error', e);
    }, (actionBarHeight) => {
      dispatch(gotUIEnvironment({ actionBarHeight: actionBarHeight / PixelRatio.get() }));
    });
  }
};
