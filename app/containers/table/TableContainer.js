import React, {
  StyleSheet,
  Navigator,
  View,
  Text,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';

import colorgyAPI from '../../utils/colorgyAPI';
import { selectTab } from '../../actions/appTabActions';

import TitleBarView from '../../components/TitleBarView';
import TitleBarIconButton from '../../components/TitleBarIconButton';

var TableContainer = React.createClass({

  _handleEdit() {
    this.props.navigator.push({ name: 'editCourse' });
  },

  render: function() {
    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={35}
        title="Table"
        rightAction={
          <TitleBarIconButton
            onPress={this._handleEdit}
            icon={require('../../assets/images/icon_mode_edit_white.png')}
          />
        }
      >

      </TitleBarView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect((state) => ({
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(TableContainer);
