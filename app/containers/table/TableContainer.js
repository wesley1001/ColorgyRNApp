import React, {
  StyleSheet,
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
import CourseCard from '../../components/CourseCard';

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
        <CourseCard />

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
