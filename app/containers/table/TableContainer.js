import React, {
  StyleSheet,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';

import THEME from '../../constants/THEME';

import Text from '../../components/Text';
import TitleBarView from '../../components/TitleBarView';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import CourseTable from '../../components/CourseTable';

import {
  doSyncUserCourses,
  doLoadTableCourses
} from '../../actions/tableActions';

var TableContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));

    if (this.props.networkConnectivity) {
      this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    }
  },

  _handleEdit() {
    this.props.navigator.push({ name: 'editCourse' });
  },

  _handleCoursePress(payload) {
    this.props.navigator.push({ name: 'course', code: payload.courseCode });
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
              <TitleBarActionIcon
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
        var courseTableWidth = this.props.windowWidth;
        var courseTableHeight = this.props.windowHeight - THEME.ANDROID_TITLE_BAR_HEIGHT - THEME.ANDROID_APP_TAB_BAR_HEIGHT;

        if (this.props.translucentStatusBar) courseTableHeight -= this.props.statusBarHeight;

        return (
          <TitleBarView
            enableOffsetTop={this.props.translucentStatusBar}
            offsetTop={this.props.statusBarHeight}
            style={this.props.style}
            title="Table"
            rightAction={
              <TitleBarActionIcon
                onPress={this._handleEdit}
                icon={require('../../assets/images/icon_mode_edit_white.png')}
              />
            }
          >
            <CourseTable
              width={courseTableWidth}
              height={courseTableHeight}
              courses={this.props.courses}
              periodData={this.props.periodData}
              onCoursePress={this._handleCoursePress}
            />

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
  tableLoading: state.table.tableLoading,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  periodData: state.table.tablePeriodData,
  windowWidth: state.deviceInfo.windowWidth,
  windowHeight: state.deviceInfo.windowHeight,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(TableContainer);
