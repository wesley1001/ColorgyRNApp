import React, {
} from 'react-native';
import { connect } from 'react-redux/native';

import TitleBarLayout from '../components/TitleBarLayout';

var AppInitializeContainer = React.createClass({

  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title=""
      >
      </TitleBarLayout>
    );
  }
});

export default connect((state) => ({
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(AppInitializeContainer);
