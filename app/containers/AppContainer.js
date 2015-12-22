import React, {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux/native';

import colorgyAPI from '../utils/colorgyAPI';
import { selectTab } from '../actions/appTabActions';
import { doClearAccessToken } from '../actions/colorgyAPIActions';

import ScrollableTabView from '../components/ScrollableTabView';
import AppTabBar from '../components/AppTabBar';

import TableContainer from './table';

var AppContainer = React.createClass({

  render: function() {
    return (
      <ScrollableTabView
        tabBar={AppTabBar}
        tabBarPosition="bottom"
        currentTab={this.props.currentTab}
        onTabChanged={(t) => this.props.dispatch(selectTab({ tab: t }))}
        edgeHitWidth={-1}
      >
        <View style={styles.container} tabLabel="我的課表">
          <TableContainer />
        </View>
        <View style={styles.container} tabLabel="活動牆">

        </View>
        <View style={styles.container} tabLabel="我的資料">
          <Text onPress={() => this.props.dispatch(doClearAccessToken()) }>Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out Log Out</Text>
        </View>
      </ScrollableTabView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect((state) => ({
  currentTab: state.appTab.currentTab
}))(AppContainer);
