import React, {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import { FBLoginManager } from 'NativeModules';

import colorgyAPI from '../utils/colorgyAPI';
import alert from '../utils/alert';

var LoginContainer = React.createClass({

  getInitialState: function() {
    return {
      fbLoading: false
    };
  },

  render: function() {
    if (this.props.loggingIn) {
      var statusText = '登入中，請稍候⋯⋯';
      if (this.props.meUpdating) statusText = '正在同步個人資料⋯⋯';
      return (
        <View style={styles.container}>
          <ProgressBarAndroid />
          <Text></Text>
          <Text>{statusText}</Text>
        </View>
      );

    } else if (this.state.fbLoading) {
      return (
        <View style={styles.container}>
          <ProgressBarAndroid />
          <Text></Text>
          <Text>正在向 Facebook 取得授權，請稍候⋯⋯</Text>
        </View>
      );

    } else {
      return (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              source={require('../assets/images/colorgy.png')} />
          </View>
          <TouchableOpacity style={styles.fbLoginButton}>
            <View>
              <Image
                style={styles.fbLoginButtonIcon}
                source={require('../assets/images/fb_white.png')} />
            </View>
            <Text
              style={styles.fbLoginButtonText}
              onPress={this._handleFBLogin} >
              使用 Facebook 登入
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  },

  _handleFBLogin: function () {
    this.setState({ fbLoading: true });

    FBLoginManager.loginWithPermissions(['email', 'public_profile', 'user_birthday', 'user_friends', 'user_events'], (error, data) => {
      if (!error) {
        var fbToken = data.token;
        colorgyAPI.requestAccessToken({ username: 'facebook:access_token', password: fbToken });
        this.setState({ fbLoading: false });
      } else {
        alert('發生錯誤！請檢查您的網路連線，以及確認您有正確登入、授權本 App 存取您的帳號');
        this.setState({ fbLoading: false });
        console.error(error);
      }
    });
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
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: 142,
    height: 162
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
  fbLoginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingBottom: 2
  }
});

export default connect((state) => ({
  loggingIn: (state.colorgyAPI.refreshingAccessToken || state.colorgyAPI.meUpdating),
  meUpdating: state.colorgyAPI.meUpdating,
  refreshingAccessToken: state.colorgyAPI.refreshingAccessToken
}))(LoginContainer);
