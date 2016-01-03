import {
  Analytics,
  Hits as GAHits
} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';

import config from '../../config';
var { googleAnalyticsID } = config;

var clientID = DeviceInfo.getUniqueID();
var appBundleID = DeviceInfo.getBundleId();
var appVersion = DeviceInfo.getVersion();

var analytics = new Analytics(googleAnalyticsID, clientID);

const ga = {
  analytics: analytics,
  sendEvent: function(category, action, label, value, experiment) {
    var gaEvent = new GAHits.Event(category, action, label, value, experiment);
    analytics.send(gaEvent);
  },
  sendScreenView: function(customAppName, screenName) {
    var screenView = new GAHits.ScreenView(customAppName, screenName, appVersion, appBundleID);
    analytics.send(screenView);
  },
}

export default ga;
