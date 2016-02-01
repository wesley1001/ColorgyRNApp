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
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import ListTitle from '../../components/ListTitle';
import ListItem from '../../components/ListItem';

import colorgyAPI from '../../utils/colorgyAPI';
import notify from '../../utils/notify';
import error from '../../utils/errorHandler';

var PrivacySettingsContainer = React.createClass({

  getInitialState: function() {
    return {
      loadingState: 'pending'
    };
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._loadData();
    });
  },

  handleBack() {
    this.props.navigator.pop();
  },

  _loadData() {
    this.setState({ loadingState: 'pending' });

    const loadDataPromises = [
      colorgyAPI.fetch(`/v1/me/user_table_settings.json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((r) => {
        if (r.status !== 200) {
          throw r;
        } else {
          return r.json();
        }
      }).then((json) => {
        this.setState({ userCoursesTableVisibility: json[0].courses_table_visibility });
      })
    ];

    Promise.all(loadDataPromises).then(() => {
      this.setState({ loadingState: 'done' });
    }).catch(() => {
      this.setState({ loadingState: 'error' });
    });
  },

  _switchUserCoursesTableVisibility() {
    var oldUserCoursesTableVisibility = this.state.userCoursesTableVisibility
    var userCoursesTableVisibility = !oldUserCoursesTableVisibility;

    this.setState({ userCoursesTableVisibility });

    colorgyAPI.fetch(`/v1/me/user_table_settings/${this.props.userID}.json`, {
      method: 'PATCH',
      body: JSON.stringify({ user_table_settings: {
        courses_table_visibility: userCoursesTableVisibility
      } }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((r) => {
      if (r.status !== 200) {
        throw r;
      } else {
        return r.json();
      }
    }).then((json) => {
      this.setState({ userCoursesTableVisibility: json.courses_table_visibility });
    }).catch((e) => {
      error('PrivacySettingsContainer: fetch error.', e);
      notify('網路錯誤。');
      this.setState({ userCoursesTableVisibility: oldUserCoursesTableVisibility });
    });
  },

  render: function() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="隱私權設定"
        actions={[
          { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this.handleBack, show: 'always' }
        ]}
      >
        <ScrollView>
          {(() => {
            switch (this.state.loadingState) {
              case 'pending':
              case 'loading':
                return (<View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 64 }}>
                  <ProgressBarAndroid styleAttr="Small" />
                  <Text></Text>
                  <Text>設定載入中</Text>
                </View>);
                break;
              case 'error':
                return (<View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 64 }}>
                  <Text>設定載入失敗，請重試</Text>
                </View>);
                break;
              case 'done':
                return (<View>
                  <ListTitle
                    text="課表"
                  />
                  <ListItem
                    text="允許其他人查看我的課表"
                    switch={true}
                    onPress={this._switchUserCoursesTableVisibility}
                    switched={this.state.userCoursesTableVisibility}
                    borderBottom={true}
                  />
                </View>);
                break;
            }
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
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(PrivacySettingsContainer);
