import React, {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  TouchableWithoutFeedback,
  Alert,
  Linking,
  NativeModules
} from 'react-native';
import { connect } from 'react-redux/native';

import Modal from 'react-native-modalbox';

import Text from '../components/Text';
import Button from '../components/Button';
import TitleBarLayout from '../components/TitleBarLayout';
import ListTitle from '../components/ListTitle';
import ListItem from '../components/ListItem';

import colorgyAPI from '../utils/colorgyAPI';
import notify from '../utils/notify';

import { hideAppTabBar, showAppTabBar } from '../actions/appTabActions';
import { setOverlayElement } from '../actions/appActions';

var FeedbackContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(hideAppTabBar());
  },

  componentWillUnmount() {
    this.props.dispatch(showAppTabBar());
  },

  getDefaultProps: function() {
    return {
      feedbackTypes: null
    };
  },

  getInitialState: function() {
    return {
      feedbackTypes: this.props.feedbackTypes || [],
      feedbackEmail: this.props.defaultEmail
    };
  },

  handleBack() {
    this.props.navigator.pop();
  },

  _handlePressFeedbackType(type) {
    var { feedbackTypes } = this.state;

    var i = feedbackTypes.indexOf(type);

    if (i >= 0) {
      feedbackTypes.splice(i, 1);
    } else {
      feedbackTypes.push(type);
    }

    this.setState({ feedbackTypes });
  },

  _handleSend() {
    if (this.state.feedbackTypes.length < 1) {
      notify('請先勾選「遇到的問題」。');
    } else {

      this.props.dispatch(setOverlayElement(
        <Modal
          ref={(m) => {
            this.isSavingModal = m;
            if (m) {
              m.reallyClose = m.close;
              // Overwrite the close function to disable closing the modal
              // when the user clicks on the backdrop
              m.close = (() => {});
              m.open();
            }
          }}
          isDisabled={false}
          swipeToClose={false}
          position="center"
          style={styles.isSavingModal}
        >
          <View style={styles.isSavingModalContent}>
            <ProgressBarAndroid />
            <Text>　</Text>
            <Text>傳送中</Text>
          </View>
        </Modal>
      ));

      setTimeout(() => {

        colorgyAPI.fetch(`/v1/me/user_app_feedbacks.json`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_app_feedbacks: {
            user_email: this.state.feedbackEmail,
            type: this.state.feedbackTypes.join(','),
            description: this.state.feedbackDescription,
            device_type: 'android',
            // TODO
            device_manufacturer: null,
            device_os_verison: null,
            app_verison: null
          } })
        }).then((r) => {
          if (r.status != 200 && r.status != 201) {
            throw r;
          } else {
            return r.json();
          }
        }).then((json) => {
          notify('回報成功送出。');
          this.handleBack();

          this.isSavingModal.reallyClose();

          setTimeout(() => {
            this.isSavingModal.reallyClose();
            this.props.dispatch(setOverlayElement(null));
          }, 500);

        }).catch((e) => {
          notify('傳送失敗！請檢查網路連線。');

          this.isSavingModal.reallyClose();

          setTimeout(() => {
            this.isSavingModal.reallyClose();
            this.props.dispatch(setOverlayElement(null));
          }, 500);
        });

      }, 1000);
    }
  },

  render: function() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title={this.props.title || 'Feedback'}
        actions={[
          { title: '返回', icon: require('../assets/images/icon_clear_white.png'), onPress: this.handleBack, show: 'always' },
          { title: '送出', icon: require('../assets/images/icon_send_white.png'), onPress: this._handleSend, show: 'always' },
        ]}
      >
        <ScrollView>
          {(() => {
            if (!this.props.feedbackTypes) return (
              <View>
                <ListTitle text="遇到的問題 (必選)" />
                <ListItem
                  checkbox={true}
                  text="找不到我的學校"
                  checked={this.state.feedbackTypes.indexOf('找不到我的學校') >= 0}
                  onPress={() => this._handlePressFeedbackType('找不到我的學校')}
                />
                <ListItem
                  checkbox={true}
                  text="找不到我的系所"
                  checked={this.state.feedbackTypes.indexOf('找不到我的系所') >= 0}
                  onPress={() => this._handlePressFeedbackType('找不到我的系所')}
                  borderTop={false}
                />
                <ListItem
                  checkbox={true}
                  text="我的課找不到"
                  checked={this.state.feedbackTypes.indexOf('我的課找不到') >= 0}
                  onPress={() => this._handlePressFeedbackType('我的課找不到')}
                  borderTop={false}
                />
                <ListItem
                  checkbox={true}
                  text="課程資訊錯誤"
                  checked={this.state.feedbackTypes.indexOf('課程資訊錯誤') >= 0}
                  onPress={() => this._handlePressFeedbackType('課程資訊錯誤')}
                  borderTop={false}
                />
                <ListItem
                  checkbox={true}
                  text="其他"
                  checked={this.state.feedbackTypes.indexOf('其他') >= 0}
                  onPress={() => this._handlePressFeedbackType('其他')}
                  borderTop={false}
                  borderBottom={true}
                />
              </View>
            );
          })()}
          <ListTitle text={`${this.props.feedbackName || '問題描述'} (選填)`} />
          <ListItem
            disabled={true}
            borderBottom={true}
          >
            <TextInput
              placeholder={this.props.feedbackPlaceholder || `簡述一下發生了什麼事......`}
              onChangeText={(t) => this.setState({ feedbackDescription: t })}
              value={this.state.feedbackDescription}
              multiline={true}
              style={{
                flex: 1,
                marginTop: 4
              }}
              numberOfLines={5}
              textAlign="start"
              textAlignVertical="top"
              underlineColorAndroid="transparent"
            />
          </ListItem>
          <ListTitle text="常用信箱 (選填)" />
          <ListItem
            disabled={true}
            borderBottom={true}
          >
            <TextInput
              placeholder={`讓我們用這個信箱回覆您`}
              onChangeText={(t) => this.setState({ feedbackEmail: t })}
              value={this.state.feedbackEmail}
              style={{
                flex: 1,
                height: 42
              }}
              underlineColorAndroid="transparent"
            />
          </ListItem>
          <ListTitle text="" />
          {(() => {
            if (this.props.hint) return (
              <View style={{ paddingHorizontal: 16, marginTop: -24 }}>
                <Text>{this.props.hint}</Text>
                <ListTitle text="" />
              </View>
            );
          })()}
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
  isSavingModal: {
    width: 200,
    height: 200,
    elevation: 24
  },
  isSavingModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect((state) => ({
  defaultEmail: state.colorgyAPI && state.colorgyAPI.me && state.colorgyAPI.me.email,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(FeedbackContainer);
