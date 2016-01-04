import React, { Platform, View, Text } from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import ScrollableTabView from '../components/ScrollableTabView';
import AppTabBar from '../components/AppTabBar';

import AppInitializeContainer from './AppInitializeContainer';
import LoginContainer from './LoginContainer';
import OrgSelectContainer from './OrgSelectContainer';
import DevModeContainer from './DevModeContainer';
import TableContainer from './table';
import BoardContainer from './board';

import { doDeviceInfo } from '../actions/deviceInfoActions';
import { selectTab } from '../actions/appTabActions';
import { doUpdateMe, doClearAccessToken } from '../actions/colorgyAPIActions';
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
          <View tabLabel="我的課表" style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
            <TableContainer />
          </View>
          <View tabLabel="活動牆" style={{ flex: 1 }}>
            <BoardContainer />
          </View>
          <View tabLabel="更多" style={{ flex: 1 }}>
            <Text onPress={() => this.props.dispatch(doClearAccessToken()) }>Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out</Text>
            <Text onPress={() => this.props.dispatch(doUpdateMe({ unconfirmedOrganizationCode: null, unconfirmedDepartmentCode: null, unconfirmedStartedYear: null })) }>Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org Clear My Org </Text>
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
  uuid: state.colorgyAPI.me && state.colorgyAPI.me.uuid,
  deviceInfo: state.deviceInfo,
  isDevMode: state.devMode.devMode,
  currentTab: state.appTab.currentTab
}))(App);
