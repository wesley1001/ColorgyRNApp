import React, { View, Text } from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import AppInitializeContainer from './AppInitializeContainer';
import LoginContainer from './LoginContainer';
import OrgSelectContainer from './OrgSelectContainer';
import DevModeContainer from './DevModeContainer';

import TableContainer from './table';

import ScrollableTabView from '../components/ScrollableTabView';
import AppTabBar from '../components/AppTabBar';

import { doGetUIEnvironment } from '../actions/uiEnvironmentActions';
import { selectTab } from '../actions/appTabActions';

import { enterDevMode } from '../actions/devModeActions';
import { doClearAccessToken } from '../actions/colorgyAPIActions';

var App = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(doGetUIEnvironment());
  },

  render: function() {
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
        <ScrollableTabView
          tabBar={AppTabBar}
          tabBarPosition="bottom"
          currentTab={this.props.currentTab}
          onTabChanged={(t) => this.props.dispatch(selectTab({ tab: t }))}
          edgeHitWidth={-1}
        >
          <View tabLabel="我的課表" style={{ flex: 1 }}>
            <TableContainer />
          </View>
          <View tabLabel="活動牆" style={{ flex: 1 }}>

          </View>
          <View tabLabel="我的資料" style={{ flex: 1 }}>
            <Text onPress={() => this.props.dispatch(doClearAccessToken()) }>Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out</Text>
            <Text onPress={() => this.props.dispatch(enterDevMode()) }>Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode Enter Dev Mode</Text>
          </View>
        </ScrollableTabView>
      );
    }
  }
});

export default connect((state) => ({
  stateReady: state.app.stateReady,
  isLogin: (state.colorgyAPI.hasAccessToken && state.colorgyAPI.meUpdatedAt),
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  uiEnvironment: state.uiEnvironment,
  isDevMode: state.devMode.devMode,
  currentTab: state.appTab.currentTab
}))(App);
