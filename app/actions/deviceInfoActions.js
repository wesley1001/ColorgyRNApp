import React, { NativeModules, NetInfo, Dimensions, PixelRatio } from 'react-native';
import { createAction } from 'redux-actions';

export const gotDeviceInfo = createAction('GOT_DEVICE_INFO');

export const doDeviceInfo = () => dispatch => {

  // Network information
  const handleNetReachabilityChange = (reachability) => {
    if (reachability === 'none' || reachability === 'NONE') reachability = null;
    if (reachability === 'unknown' || reachability === 'UNKNOWN') reachability = undefined;
    if (reachability === 'cell') reachability = 'mobile';
    if (typeof reachability === 'string') reachability = reachability.toLowerCase();
    dispatch(gotDeviceInfo({ networkReachability: reachability }));
  };
  NetInfo.fetch().done(handleNetReachabilityChange);
  NetInfo.addEventListener('change', handleNetReachabilityChange);

  const handleNetConnectivityChange = (isConnected) => {
    dispatch(gotDeviceInfo({ networkConnectivity: isConnected }));
  };
  NetInfo.isConnected.fetch().done(handleNetConnectivityChange);
  NetInfo.isConnected.addEventListener('change', handleNetConnectivityChange);

  // UI variables
  var windowWidth = Dimensions.get('window').width;
  var windowHeight = Dimensions.get('window').height;
  dispatch(gotDeviceInfo({ windowWidth, windowHeight }));

  var pixelRatio = PixelRatio.get();
  dispatch(gotDeviceInfo({ pixelRatio }));

  if (NativeModules.SystemWindowAndroid) {
    NativeModules.SystemWindowAndroid.isTranslucentStatusBar((e) => {
      console.error('doDeviceInfo error', e);
    }, (translucentStatusBar) => {
      dispatch(gotDeviceInfo({ translucentStatusBar: translucentStatusBar }));
    });

    NativeModules.SystemWindowAndroid.isTranslucentActionBar((e) => {
      console.error('doDeviceInfo error', e);
    }, (translucentActionBar) => {
      dispatch(gotDeviceInfo({ translucentActionBar: translucentActionBar }));
    });

    NativeModules.SystemWindowAndroid.getStatusBarHeight((e) => {
      console.error('doDeviceInfo error', e);
    }, (statusBarHeight) => {
      dispatch(gotDeviceInfo({ statusBarHeight: statusBarHeight / PixelRatio.get() }));
    });

    NativeModules.SystemWindowAndroid.getActionBarHeight((e) => {
      console.error('doDeviceInfo error', e);
    }, (actionBarHeight) => {
      dispatch(gotDeviceInfo({ actionBarHeight: actionBarHeight / PixelRatio.get() }));
    });
  }
};
