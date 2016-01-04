import {
  Analytics,
  Hits as GAHits
} from 'react-native-google-analytics';
import GoogleAnalytics from 'react-native-google-analytics-native';
import DeviceInfo from 'react-native-device-info';

import config from '../../config';
var { googleAnalyticsID } = config;

var gaType = 'native';
GoogleAnalytics.startTracker(googleAnalyticsID);
var webAnalytics = new Analytics(googleAnalyticsID, clientID);

GoogleAnalytics.isGooglePlayServicesAvailable().then((availability) => {
  if (availability) {
    console.log('GA: Using native ga.');
    gaType = 'native';
  } else {
    console.log('GA: Using web ga.');
    gaType = 'web';
  }
});

var clientID = DeviceInfo.getUniqueID();
var appBundleID = DeviceInfo.getBundleId();
var appVersion = DeviceInfo.getVersion();

const ga = {
  sendEvent: function(category, action, label, value, experiment) {
    if (gaType === 'native') {
      GoogleAnalytics.trackEvent(category, action, label, value);
    } else if (gaType === 'web') {
      var gaEvent = new GAHits.Event(category, action, label, value, experiment);
      webAnalytics.send(gaEvent);
    }
  },
  sendScreenView: function(screenName) {
    if (gaType === 'native') {
      GoogleAnalytics.trackView('', screenName);
    } else if (gaType === 'web') {
      var screenView = new GAHits.ScreenView('', screenName, appVersion, appBundleID);
      webAnalytics.send(screenView);
    }
  },
  sendException: function(description, isFatal = false) {
    if (gaType === 'native') {
      GoogleAnalytics.trackException(description, isFatal);
    }
  },
  sendTiming: function(category, timeInMilliseconds, name, label) {
    if (gaType === 'native') {
      GoogleAnalytics.trackTiming(category, timeInMilliseconds, name, label);
    }
  },
  setUserID: function(userID) {
    if (gaType === 'native') {
      GoogleAnalytics.setUserID(userID);
    }
  }
}

export default ga;
