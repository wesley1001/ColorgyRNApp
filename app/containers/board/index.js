import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';

import ga from '../../utils/ga';

var Board = React.createClass({

  componentWillMount() {
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },

  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        title="Colorgy"
        leftAction={
          <TitleBarActionIcon onPress={this._handleBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TitleBarActionIcon>
        }
      >
        <WebView
          ref={(webView) => this.webView = webView}
          automaticallyAdjustContentInsets={false}
          url={'https://google.com'}
          javaScriptEnabledAndroid={true}
          domStorageEnabledAndroid={true}
          startInLoadingState={true}
          style={styles.webView}
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
