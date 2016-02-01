import React, {
  Navigator,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';

import MoreMenuContainer from './MoreMenuContainer';
import PrivacySettingsContainer from './PrivacySettingsContainer';
import FeedbackContainer from '../FeedbackContainer';

import ga from '../../utils/ga';

var MoreContainer = React.createClass({

  componentWillMount() {
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigateBackCount !== this.props.navigateBackCount) {
      this.navigator.pop();
    } else if (nextProps.tabRePressCount !== this.props.tabRePressCount) {
      if (this.navigator) this.navigator.popToTop();
    }
  },

  _registerNavigator(navigator) {
    if (!navigator) return;
    this.navigator = navigator;

    navigator.navigationContext.addListener('didfocus', (e) => {
      this._reportRouteUpdate();
    });

    this._reportRouteUpdate();
  },

  _reportRouteUpdate() {
    var currentRouteStack = this.navigator.state.routeStack;
    var currentRoute = currentRouteStack[currentRouteStack.length - 1];
    var currentRouteString = JSON.stringify(currentRoute);

    ga.sendScreenView(`More:${currentRouteString}`);
  },

  render() {
    return (
      <Navigator
        ref={(navigator) => this._registerNavigator(navigator)}
        initialRoute={{ name: 'index' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'index':
              return (
                <MoreMenuContainer navigator={navigator} />
              );
              break;
            case 'privacySettings':
              return (
                <PrivacySettingsContainer navigator={navigator} />
              );
              break;
            case 'feedback':
              return (
                <FeedbackContainer navigator={navigator} />
              );
              break;
          }
        }}
        configureScene={(route) => {
          switch(route.name) {
            case 'index':
            case 'feedback':
              return Navigator.SceneConfigs.FloatFromBottom;
              break;
            default:
              return Navigator.SceneConfigs.FloatFromRight;
              break;
          }
        }}
      />
    );
  }
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  // navigateBackCount: state.table.navigateBackCount,
  // tabRePressCount: state.appTab.rePressCountOnTab['0'],
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(MoreContainer);
