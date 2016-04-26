import React, {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  NativeModules,
  InteractionManager,
  TextInput
} from 'react-native';
import { connect } from 'react-redux/native';

import { doLoadTableCourses } from '../../actions/tableActions';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import ListTitle from '../../components/ListTitle';
import ListItem from '../../components/ListItem';

import colorgyAPI from '../../utils/colorgyAPI';
import notify from '../../utils/notify';
import error from '../../utils/errorHandler';

var CourseNotificationSettingsContainer = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._loadData();
    });
  },

  handleBack() {
    this.props.navigator.pop();
  },

  componentWillUnmount() {
    console.log(this.props.userId, this.props.organizationCode);
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
  },

  render: function() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="課程通知設定"
        actions={[
          { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this.handleBack, show: 'always' }
        ]}
      >
        <ScrollView>
          <ListTitle
            text="通知開關"
          />
          <ListItem
            text="啟用上課通知"
            switch={true}
            onPress={() => {
              this.props.dispatch({ type: 'TOGGLE_NOTIFICATION_ENABLED' })
            }}
            switched={this.props.notificationEnabled}
            borderBottom={true}
          />
          <ListTitle text="提醒時間" />
          <ListItem
            disabled={true}
            borderBottom={true}
          >
            <TextInput
              placeholder={`提醒時間 (分鐘)`}
              onChangeText={(t) => {
                this.props.dispatch({ type: 'SET_NOTIFICATION_BEFORE_MINUTES', minutes: parseInt(t) })
              }}
              value={this.props.notificationBeforeMinutes.toString()}
              style={{
                flex: 1,
                height: 42
              }}
              underlineColorAndroid="transparent"
            />
          </ListItem>
        </ScrollView>
      </TitleBarLayout>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F5',
    justifyContent:'center',
    alignItems: 'center'
  },
  logo: {
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: 180
  },
  fbLoginButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16
  },
  fbLoginButtonIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  disabledFbLoginButton: {
    backgroundColor: '#AAAAAA'
  },
  fbLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingBottom: 2
  }
});

export default connect((state) => ({
  userID: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight,
  notificationEnabled: state.table.notificationEnabled,
  notificationBeforeMinutes: state.table.notificationBeforeMinutes
}))(CourseNotificationSettingsContainer);
