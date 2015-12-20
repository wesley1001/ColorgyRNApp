import React from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import { doGetUIEnvironment } from '../actions/uiEnvironmentActions';

import LoginContainer from './LoginContainer';
import OrgSelectContainer from './OrgSelectContainer';
import AppContainer from './AppContainer';
import DevModeContainer from './DevModeContainer';

var App = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(doGetUIEnvironment());
  },

  render: function() {
    if (this.props.isDevMode) {
      return (<DevModeContainer />);
    } else if (this.props.isLogin) {
      if (this.props.organizationCode) {
        return(
          <AppContainer />
        );
      } else {
        return(
          <OrgSelectContainer />
        );
      }
    } else {
      return(
        <LoginContainer />
      );
    }
  }
});

export default connect((state) => ({
  isLogin: (state.colorgyAPI.hasAccessToken && state.colorgyAPI.meUpdatedAt),
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  uiEnvironment: state.uiEnvironment,
  isDevMode: state.devMode.devMode
}))(App);
