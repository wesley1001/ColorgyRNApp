import React, {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../components/Text';
import TitleBarLayout from '../components/TitleBarLayout';
import ListItem from '../components/ListItem';

import colorgyAPI from '../utils/colorgyAPI';
import notify from '../utils/notify';
import chatAPI from '../utils/chatAPI';

import { doClearAccessToken } from '../actions/colorgyAPIActions';
import { doEnterDevModePress } from '../actions/devModeActions';

var MoreContainer = React.createClass({

  getInitialState: function() {
    return {
      fbLoading: false
    };
  },

  _showLogoutAlert() {
    Alert.alert('確認登出', '確定要登出嗎？一旦登出後，所有未同步到網路的資料將會消失！', [
       { text: '取消' },
       { text: '確定登出', onPress: this._handleLogout }
    ]);
  },

  _handleLogout() {
    this.props.dispatch(doClearAccessToken());
    chatAPI.clean_storage();
  },

  render: function() {
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
                source={require('../assets/images/colorgy_icon_with_text.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <ListItem
            text="問題回報"
            disabled={true}
            onDisabledPress={() => notify('此功能尚未啟用')}
          />
          <ListItem
            text="關於我們"
            disabled={true}
            onDisabledPress={() => notify('此功能尚未啟用')}
          />
          <ListItem
            text="登出"
            onPress={this._showLogoutAlert}
            last={true}
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
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(MoreContainer);
