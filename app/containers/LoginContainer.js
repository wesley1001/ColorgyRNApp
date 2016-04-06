import React, {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ProgressBarAndroid,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/Zocial';

import { FBLoginManager } from 'NativeModules';

import Text from '../components/Text';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import GhostButton from '../components/GhostButton';

import colorgyAPI from '../utils/colorgyAPI';
import chatAPI from '../utils/chatAPI';
import notify from '../utils/notify';

import { doEnterDevModePress } from '../actions/devModeActions';

var LoginContainer = React.createClass({

  getInitialState: function() {
    return {
      fbLoading: false
    };
  },
  _useEmailLogin: function() {
    this.setState({ emailLogin: true, register: false });
  },
  _useFBLogin: function() {
    this.setState({ emailLogin: false });
  },
  _signUp() {
    colorgyAPI.fetch('/v1/sign_up.json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: {
        email: this.state.loginEmail,
        password: this.state.loginPassword,
        name: this.state.registerName
      } })
    }).then((r) => {
      return r.json();
    }).then((json) => {
      if (json.error) {
        notify(json.description);
      } else {
        notify('註冊成功！請至電子信箱收取認證信後，即可登入');
        this.setState({ emailLogin: true, register: false });
      }
    }).catch((e) => {
      notify('註冊失敗');
    });
  },
  render: function() {
    var { networkConnectivity } = this.props;

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

    } else if (this.state.emailLogin) {
      return (
        <View style={styles.container}>
          <Image
            style={styles.logoImage}
            source={require('../assets/images/colorgy_icon_with_text.png')}
          />
          <Text style={{ marginTop: -2, marginBottom: 18 }}>電子郵件登入或註冊</Text>
          <View style={{ borderWidth: 1.2, borderColor: '#F89680', borderRadius: 3, marginVertical: 4, marginHorizontal: 32 }}>
            <TextInput
              style={{ paddingHorizontal: 8, paddingVertical: 2 }}
              underlineColorAndroid="transparent"
              placeholder="Email 信箱"
              placeholderTextColor="#F89680AA"
              onChangeText={(loginEmail) => this.setState({ loginEmail })}
              value={this.state.loginEmail}
            />
          </View>
          <View style={{ borderWidth: 1.2, borderColor: '#F89680', borderRadius: 3, marginVertical: 4, marginHorizontal: 32 }}>
            <TextInput
              style={{ paddingHorizontal: 8, paddingVertical: 2 }}
              underlineColorAndroid="transparent"
              placeholder="密碼 (8 個字以上)"
              placeholderTextColor="#F89680AA"
              secureTextEntry={true}
              onChangeText={(loginPassword) => this.setState({ loginPassword })}
              value={this.state.loginPassword}
            />
          </View>
          {(() => {
            if (this.state.register) {
              return (
                <View style={{ borderWidth: 1.2, borderColor: '#F89680', borderRadius: 3, marginVertical: 4, marginHorizontal: 32 }}>
                  <TextInput
                    style={{ paddingHorizontal: 8, paddingVertical: 2 }}
                    underlineColorAndroid="transparent"
                    placeholder="姓名"
                    placeholderTextColor="#F89680AA"
                    secureTextEntry={true}
                    onChangeText={(registerName) => this.setState({ registerName })}
                    value={this.state.registerName}
                  />
                </View>
              );
            }
          })()}

          {(() => {
            if (this.state.register) {
              return (
                <View style={{ flexDirection: 'row', paddingBottom: 32 }}>
                  <Button
                    style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                    text="註冊新帳號"
                    disabled={!(this.state.loginEmail && this.state.loginPassword && this.state.registerName)}
                    onPress={() => this._signUp()}
                  />
                </View>
              );
            } else {
              return (
                <View style={{ flexDirection: 'row', paddingBottom: 32 }}>
                  <GhostButton
                    style={{ flex: 3, marginTop: 24, marginRight: 12 }}
                    text="註冊新帳號"
                    disabled={!(this.state.loginEmail && this.state.loginPassword)}
                    onPress={() => this.setState({ register: true })}
                  />
                  <Button
                    style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                    text="登入"
                    disabled={!(this.state.loginEmail && this.state.loginPassword)}
                    onPress={() => colorgyAPI.requestAccessToken({ username: this.state.loginEmail, password: this.state.loginPassword })}
                  />
                </View>
              );
            }
          })()}

          <TouchableOpacity onPress={this._useFBLogin} style={{ marginTop: 24 }}>
            <View style={{ backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#F89680' }}>
              <Text style={{ color: '#F89680' }}>
                使用 Facebook 登入
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );

    } else {
      return (
        <View style={styles.container}>
          <View style={styles.logo}>
            <TouchableWithoutFeedback
              onPress={() => this.props.dispatch(doEnterDevModePress())}
            >
              <Image
                style={styles.logoImage}
                source={require('../assets/images/colorgy_icon_with_text.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <TouchableOpacity style={[styles.fbLoginButton, !networkConnectivity && styles.disabledFbLoginButton]}>
            <View style={{ marginRight: 4 }}>
              <Icon name="facebook" style={styles.fbLoginButtonText} />
            </View>
            <Text
              style={styles.fbLoginButtonText}
              onPress={this._handleFBLogin} >
              {networkConnectivity ? '使用 Facebook 登入' : '請連上網路後再登入'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._useEmailLogin} style={{ marginTop: 28 }}>
            <View style={{ backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#F89680' }}>
              <Text style={{ color: '#F89680' }}>
                使用電子郵件登入
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  },

  _handleFBLogin: function () {
    this.setState({ fbLoading: true }, () => {
      setTimeout(() => {
        FBLoginManager.loginWithPermissions(['email', 'public_profile', 'user_birthday', 'user_friends', 'user_events'], (error, data) => {
          if (!error) {
            var fbToken = data.token;
            colorgyAPI.requestAccessToken({ username: 'facebook:access_token', password: fbToken });
            this.setState({ fbLoading: false });
          } else {
            notify('發生錯誤！請檢查您的網路連線，以及確認您有正確登入、授權本 App 存取您的帳號');
            this.setState({ fbLoading: false });
            console.error(error);
          }
        });
      }, 100);
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
    marginBottom: 8,
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
  loggingIn: (state.colorgyAPI.refreshingAccessToken || state.colorgyAPI.meUpdating),
  meUpdating: state.colorgyAPI.meUpdating,
  refreshingAccessToken: state.colorgyAPI.refreshingAccessToken,
  networkConnectivity: state.deviceInfo.networkConnectivity
}))(LoginContainer);
