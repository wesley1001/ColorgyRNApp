import React, {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';

import {
  doSyncUserCourses,
  doLoadTableCourses
} from '../../actions/tableActions';

import TitleBarView from '../../components/TitleBarView';
import TitleBarIconButton from '../../components/TitleBarIconButton';
import CourseCard from '../../components/CourseCard';

var TableContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
  },

  _handleEdit() {
    this.props.navigator.push({ name: 'editCourse' });
  },

  render() {
    switch (this.props.tableStatus) {
      case 'new':
        return (
          <TitleBarView
            enableOffsetTop={this.props.translucentStatusBar}
            offsetTop={this.props.statusBarHeight}
            title="Table"
            rightAction={
              <TitleBarIconButton
                onPress={this._handleEdit}
                icon={require('../../assets/images/icon_mode_edit_white.png')}
              />
            }
          >
            <Text>Loading</Text>

          </TitleBarView>
        );
        break;

      default:
        return (
          <TitleBarView
            enableOffsetTop={this.props.translucentStatusBar}
            offsetTop={this.props.statusBarHeight}
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
        break;
    }
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
