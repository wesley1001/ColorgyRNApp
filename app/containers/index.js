import React, { Platform, View, Text } from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import ScrollableTab from '../components/ScrollableTab';
import AppTabBar from '../components/AppTabBar';

import AppInitializeContainer from './AppInitializeContainer';
import LoginContainer from './LoginContainer';
import OrgSelectContainer from './OrgSelectContainer';
import DevModeContainer from './DevModeContainer';
import TableContainer from './table';
import BoardContainer from './board';
import MoreContainer from './MoreContainer';

import { doDeviceInfo } from '../actions/deviceInfoActions';
import { selectTab } from '../actions/appTabActions';
import { doUpdateMe } from '../actions/colorgyAPIActions';
import { enterDevMode } from '../actions/devModeActions';
import { doBackPress } from '../actions/appActions';

import ga from '../utils/ga';

var App = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(doDeviceInfo());

    if (Platform.OS === 'android') {
      React.BackAndroid.addEventListener('hardwareBackPress', () => {
        this.props.dispatch(doBackPress());
        return true;
      });
    }
  },

  componentDidMount: function() {
    ga.setUserID(this.props.uuid);
    ga.sendScreenView('Start');
  },

  render: function() {
    var { overlayElement } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {(() => {
          if (this.props.isDevMode) {
            return (<DevModeContainer />);

          } else if (!this.props.stateReady) {
            return (<AppInitializeContainer />);

          } else if (!this.props.isLogin) {
            return(<LoginContainer />);

          } else if (!this.props.organizationCode) {
            return(<OrgSelectContainer />);

          } else {
            return(
              <ScrollableTab
                tabBar={AppTabBar}
                tabBarPosition="bottom"
                currentTab={this.props.currentTab}
                onTabChanged={(t) => this.props.dispatch(selectTab({ tab: t }))}
                edgeHitWidth={-1}
                renderTabBar={!this.props.hideAppTabBar}
              >
                <View tabLabel="我的課表" style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
                  <TableContainer />
                </View>
                <View tabLabel="活動牆" style={{ flex: 1 }}>
                  <BoardContainer />
                </View>
                <View tabLabel="更多" style={{ flex: 1 }}>
                  <MoreContainer />
                </View>
              </ScrollableTab>
            );
          }
        })()}

        {overlayElement}
      </View>
    );
  }
});

export default connect((state) => ({
  stateReady: state.app.stateReady,
  overlayElement: state.app.overlayElement,
  isLogin: (state.colorgyAPI.hasAccessToken && state.colorgyAPI.meUpdatedAt),
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  uuid: state.colorgyAPI.me && state.colorgyAPI.me.uuid,
  deviceInfo: state.deviceInfo,
  isDevMode: state.devMode.devMode,
  currentTab: state.appTab.currentTab,
  hideAppTabBar: state.appTab.hideAppTabBar
}))(App);
