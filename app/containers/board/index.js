import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid,
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';

import colorgyAPI from '../../utils/colorgyAPI';
import ga from '../../utils/ga';

var Board = React.createClass({

  getInitialState() {
    return {
      url: ''
    };
  },

  componentWillMount() {
  },

  componentDidMount() {
    colorgyAPI.getAccessToken().then((token) => {
      this.setState({ url: `https://colorgy.io/sso_new_session?access_token=${token}` });
    });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigateBackCount !== this.props.navigateBackCount) {
      if (!this.state.backButtonEnabled) {
        BackAndroid.exitApp();
      } else {
        this.webView.goBack();
      }
    } else if (nextProps.tabRePressCount !== this.props.tabRePressCount) {
      this.setState({ url: `https://mall.colorgy.io/?randID=${parseInt(Math.random()*100000000)}` });
    }
  },

  _reportRouteUpdate() {
  },

  handleBack() {
    this.webView.goBack();
  },

  handleReload() {
    this.webView.reload();
  },

  handleGoHome() {
    this.setState({ url: `https://mall.colorgy.io/?randID=${parseInt(Math.random()*100000000)}` });
  },

  onNavigationStateChange: function(navState) {
    if (/sso_new_session\?access_token=/.test(navState.url)) {
      this.handleGoHome();
      return;
    }

    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      currentUrl: navState.url,
      title: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  },

  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        title={this.state.title || 'Colorgy'}
        actions={[
          (this.state.backButtonEnabled ? { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this.handleBack, show: 'always' } : null),
          { title: '回首頁', icon: require('../../assets/images/icon_home_white.png'), onPress: this.handleGoHome, show: 'always' },
          (this.state.loading ? { title: '重新整理', icon: require('../../assets/images/icon_refresh_white.png'), onPress: this.handleReload, show: 'always' } : { title: '重新整理', icon: require('../../assets/images/icon_refresh_white.png'), onPress: this.handleReload, show: 'always' }),
        ]}
      >
        <WebView
          ref={(webView) => this.webView = webView}
          automaticallyAdjustContentInsets={true}
          url={this.state.url}
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabledAndroid={true}
          domStorageEnabledAndroid={true}
          startInLoadingState={true}
          style={styles.webView}
          injectedJavaScript="document.body.style.height = 'auto';"
        />
      </TitleBarLayout>
    );
  }
});

var styles = StyleSheet.create({
  webView: {
    flex: 1
  },
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  navigateBackCount: state.board.navigateBackCount,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Board);
