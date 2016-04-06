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
  NativeModules
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import ListTitle from '../../components/ListTitle';
import ListItem from '../../components/ListItem';

import colorgyAPI from '../../utils/colorgyAPI';
import notify from '../../utils/notify';
import chatAPI from '../../utils/chatAPI';

import { doClearAccessToken } from '../../actions/colorgyAPIActions';
import { doEnterDevModePress } from '../../actions/devModeActions';
import { doUpdateMe } from '../../actions/colorgyAPIActions';

var MoreContainer = React.createClass({

  getInitialState: function() {
    return {
      fbLoading: false
    };
  },

  _openAboutURL() {
    if (NativeModules.OpenURLAndroid) {
      NativeModules.OpenURLAndroid.openURL('https://www.facebook.com/Colorgy-1529686803975150/', (e)=> {
        console.error(e);
      }, () => {
      });
    }
  },

  _showLogoutAlert() {
    Alert.alert('確認登出', '確定要登出嗎？一旦登出後，所有未同步到網路的資料將會消失！', [
       { text: '取消' },
       { text: '確定登出', onPress: this._handleLogout }
    ]);
  },

  _showClearOrgAlert() {
    Alert.alert('確認清除資料', '確定要重選學校嗎？您原本設定的學校、系所、入學年度將被清除！', [
       { text: '取消' },
       { text: '確定清除', onPress: this._clearOrg }
    ]);
  },

  _clearOrg() {
    this.props.dispatch(doUpdateMe({ unconfirmedOrganizationCode: null, unconfirmedDepartmentCode: null, unconfirmedStartedYear: null }));
    this.setState({ orgClearing: true });
  },

  _handleLogout() {
    this.props.dispatch(doClearAccessToken());
    chatAPI.clean_storage();
  },

  render: function() {
    if (this.state.orgClearing) {
      return (
        <TitleBarLayout
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          title="更多"
        >
         <Text> </Text>
         <Text> </Text>
         <Text>正在清除您的學校......</Text>
        </TitleBarLayout>
      );
    }

    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="更多"
      >
        <ScrollView>
          <View style={styles.logo} onPress={() => alert('hi')}>
            <TouchableWithoutFeedback
              onPress={() => this.props.dispatch(doEnterDevModePress())}
            >
              <Image
                style={styles.logoImage}
                source={require('../../assets/images/colorgy_icon_with_text.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <ListItem
            text="上課通知設定"
            onPress={() => { this.props.navigator.push({ name: 'courseNotificationSettings' }); }}
          />
          <ListItem
            text="隱私權設定"
            onPress={() => { this.props.navigator.push({ name: 'privacySettings' }); }}
          />
          {(() => {
            if (!this.props.userOrg) {
              return (
                <ListItem
                  text="重新選擇學校、系所、入學年度"
                  onPress={this._showClearOrgAlert}
                />
              );
            }
          })()}
          <ListItem
            text="問題回報"
            onPress={() => { this.props.navigator.push({ name: 'feedback' }); }}
          />
          <ListItem
            text="關於我們"
            onPress={this._openAboutURL}
          />
          <ListItem
            text="登出"
            onPress={this._showLogoutAlert}
            borderBottom={true}
          />
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
  userOrg: state.colorgyAPI && state.colorgyAPI.me && state.colorgyAPI.me.organizationCode,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(MoreContainer);
