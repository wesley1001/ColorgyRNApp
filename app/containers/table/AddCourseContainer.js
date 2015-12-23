import React, {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';

import { doLoadTableCourses } from '../../actions/tableActions';

import TitleBarView from '../../components/TitleBarView';
import TitleBarIconButton from '../../components/TitleBarIconButton';

var TableContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  render() {
    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={35}
        title="加選課程"
        leftAction={
          <TitleBarIconButton
            onPress={this._handleBack}
            icon={require('../../assets/images/icon_arrow_back_white.png')}
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
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(TableContainer);
