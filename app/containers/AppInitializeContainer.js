import React, {
} from 'react-native';
import { connect } from 'react-redux/native';

import TitleBarView from '../components/TitleBarView';

var AppInitializeContainer = React.createClass({

  render() {
    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title=""
      >
      </TitleBarView>
    );
  }
});

export default connect((state) => ({
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(AppInitializeContainer);
