import React, {
} from 'react-native';
import { connect } from 'react-redux/native';

import TitleBarView from '../components/TitleBarView';

var AppInitializeContainer = React.createClass({

  render() {
    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={35}
        title=""
      >
      </TitleBarView>
    );
  }
});

export default connect((state) => ({
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(AppInitializeContainer);
