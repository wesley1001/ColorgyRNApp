import React from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import LoginContainer from './LoginContainer';
import AppContainer from './AppContainer';

var App = React.createClass({

  render: function() {
    if (this.props.isLogin) {
      return(
        <AppContainer />
      );
    } else {
      return(
        <LoginContainer />
      );
    }
  }
});

export default connect((state) => ({
  isLogin: state.colorgyAPI.hasAccessToken
}))(App);
